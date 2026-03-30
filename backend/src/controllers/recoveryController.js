const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { revokeAllUserSessions } = require('../services/sessionService');

const RESET_MSG =
  'Si el número está registrado, recibirás instrucciones para restablecer tu contraseña.';

function hashToken(plain) {
  return crypto.createHash('sha256').update(plain, 'utf8').digest('hex');
}

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * POST /auth/recover — no revela si el teléfono existe.
 */
const recover = async (req, res) => {
  const { phone } = req.body;
  if (!phone || typeof phone !== 'string' || phone.length !== 10) {
    return res.status(400).json({ msg: 'Teléfono inválido (10 dígitos).' });
  }

  try {
    const userRes = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);

    if (userRes.rows.length > 0) {
      await pool.query(
        `UPDATE password_resets SET used = TRUE WHERE phone = $1 AND used = FALSE`,
        [phone]
      );

      const plain = generateResetToken();
      const tokenHash = hashToken(plain);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await pool.query(
        `INSERT INTO password_resets (phone, token_hash, expires_at, used)
         VALUES ($1, $2, $3, FALSE)`,
        [phone, tokenHash, expiresAt]
      );

      if (process.env.NODE_ENV !== 'production') {
        console.info('[password reset demo] phone=%s token=%s', phone, plain);
      }
    }

    return res.status(200).json({ msg: RESET_MSG });
  } catch (e) {
    console.error('recover:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

/**
 * POST /auth/reset-password
 */
const resetPassword = async (req, res) => {
  const { phone, token, password } = req.body;

  if (!phone || typeof phone !== 'string' || phone.length !== 10) {
    return res.status(400).json({ msg: 'Datos inválidos.' });
  }
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ msg: 'Datos inválidos.' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const tokenHash = hashToken(token);
    const pr = await pool.query(
      `SELECT id, phone FROM password_resets
       WHERE phone = $1 AND token_hash = $2 AND used = FALSE AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [phone, tokenHash]
    );

    if (pr.rows.length === 0) {
      return res.status(400).json({ msg: 'Token inválido o expirado.' });
    }

    const resetId = pr.rows[0].id;

    const userRes = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (userRes.rows.length === 0) {
      await pool.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [resetId]);
      return res.status(400).json({ msg: 'Token inválido o expirado.' });
    }

    const userId = userRes.rows[0].id;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
    await pool.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [resetId]);
    await revokeAllUserSessions(userId);

    return res.json({ msg: 'Contraseña actualizada. Inicia sesión de nuevo.' });
  } catch (e) {
    console.error('resetPassword:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

module.exports = { recover, resetPassword };

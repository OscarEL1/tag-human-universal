/**
 * Recuperación de contraseña por OTP — flujo independiente del legacy (/recover, password_resets).
 *
 * Por qué hashear OTP y resetToken en BD:
 * - Si la base filtra (backup, logs, SQL injection parcial), el atacante no obtiene códigos usables.
 * - OTP de 6 dígitos es un espacio pequeño; el hash + invalidación + intentos limita fuerza bruta offline.
 *
 * Por qué expiran:
 * - Ventana corta reduce riesgo de robo del código/token y replay tardío.
 *
 * Por qué separar OTP y resetToken:
 * - OTP: factor de posesión de corta vida, máximo intentos; sirve solo para demostrar control del teléfono.
 * - resetToken: secreto de un solo uso de mayor entropía (32 bytes) para el paso final de cambio de contraseña
 *   sin exponer la sesión ni mezclar con el flujo de email/link legacy.
 *
 * Ataques que se mitigan (en conjunto con HTTPS, rate limiting recomendado en producción):
 * - Enumeración de usuarios: respuesta genérica en request-otp.
 * - Robo de BD: no hay secretos en claro.
 * - Replay de OTP: expiración + invalidación al pedir uno nuevo + límite de intentos.
 * - Replay de reset: token de un solo uso + expiración.
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { revokeAllUserSessions } = require('./sessionService');

const OTP_TTL_MS = 5 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 3;

const GENERIC_OTP_MSG = 'Si el número existe, se enviará un código';
const VERIFY_FAIL_MSG = 'Código inválido o expirado';
const RESET_SUCCESS_MSG = 'Contraseña actualizada correctamente';

function hashToken(plain) {
  return crypto.createHash('sha256').update(plain, 'utf8').digest('hex');
}

/**
 * Hash del OTP enlazado a teléfono + pepper opcional para no almacenar el código en claro.
 */
function hashOtp(phone, sixDigitCode) {
  const pepper = process.env.OTP_PEPPER || 'change-me-in-production';
  return crypto
    .createHash('sha256')
    .update(`${pepper}:${phone}:${sixDigitCode}`, 'utf8')
    .digest('hex');
}

function generateSixDigitOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

function generateResetTokenPlain() {
  return crypto.randomBytes(32).toString('hex');
}

function timingSafeEqualHex(a, b) {
  try {
    const ba = Buffer.from(a, 'hex');
    const bb = Buffer.from(b, 'hex');
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

async function requestOtp(phone) {
  const out = { msg: GENERIC_OTP_MSG };

  const userRes = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
  if (userRes.rows.length === 0) {
    return out;
  }

  const userId = userRes.rows[0].id;
  await pool.query('DELETE FROM otp_codes WHERE user_id = $1', [userId]);

  const code = generateSixDigitOtp();
  const codeHash = hashOtp(phone, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await pool.query(
    `INSERT INTO otp_codes (user_id, phone, code_hash, expires_at, attempts)
     VALUES ($1, $2, $3, $4, 0)`,
    [userId, phone, codeHash, expiresAt]
  );

  if (process.env.NODE_ENV !== 'production') {
    out.otp = code;
    console.info('[otp recovery dev] phone=%s otp=%s', phone, code);
  }

  return out;
}

async function verifyOtp(phone, code) {
  if (!/^\d{6}$/.test(String(code || ''))) {
    return { ok: false, msg: VERIFY_FAIL_MSG };
  }

  const userRes = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
  if (userRes.rows.length === 0) {
    return { ok: false, msg: VERIFY_FAIL_MSG };
  }
  const userId = userRes.rows[0].id;

  const otpRes = await pool.query(
    `SELECT id, code_hash, expires_at, attempts FROM otp_codes
     WHERE user_id = $1 AND phone = $2
     ORDER BY id DESC LIMIT 1`,
    [userId, phone]
  );

  if (otpRes.rows.length === 0) {
    return { ok: false, msg: VERIFY_FAIL_MSG };
  }

  const row = otpRes.rows[0];
  const now = Date.now();
  if (new Date(row.expires_at).getTime() < now) {
    await pool.query('DELETE FROM otp_codes WHERE id = $1', [row.id]);
    return { ok: false, msg: VERIFY_FAIL_MSG };
  }

  if (row.attempts >= MAX_OTP_ATTEMPTS) {
    await pool.query('DELETE FROM otp_codes WHERE id = $1', [row.id]);
    return { ok: false, msg: VERIFY_FAIL_MSG };
  }

  const tryHash = hashOtp(phone, String(code).padStart(6, '0'));
  const match = timingSafeEqualHex(row.code_hash, tryHash);

  if (!match) {
    await pool.query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1', [row.id]);
    const after = await pool.query('SELECT attempts FROM otp_codes WHERE id = $1', [row.id]);
    if (after.rows[0] && after.rows[0].attempts >= MAX_OTP_ATTEMPTS) {
      await pool.query('DELETE FROM otp_codes WHERE id = $1', [row.id]);
    }
    return { ok: false, msg: VERIFY_FAIL_MSG };
  }

  await pool.query('DELETE FROM otp_codes WHERE user_id = $1', [userId]);

  await pool.query(
    `UPDATE otp_reset_tokens SET used = TRUE
     WHERE user_id = $1 AND used = FALSE`,
    [userId]
  );

  const plainReset = generateResetTokenPlain();
  const tokenHash = hashToken(plainReset);
  const exp = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await pool.query(
    `INSERT INTO otp_reset_tokens (user_id, token_hash, expires_at, used)
     VALUES ($1, $2, $3, FALSE)`,
    [userId, tokenHash, exp]
  );

  return { ok: true, resetToken: plainReset };
}

async function resetPasswordWithOtpToken(phone, plainResetToken, newPassword) {
  const userRes = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
  if (userRes.rows.length === 0) {
    return { ok: false, status: 400, msg: 'Token inválido o expirado.' };
  }
  const userId = userRes.rows[0].id;
  const tokenHash = hashToken(plainResetToken);

  const tokRes = await pool.query(
    `SELECT id FROM otp_reset_tokens
     WHERE user_id = $1 AND token_hash = $2 AND used = FALSE AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [userId, tokenHash]
  );

  if (tokRes.rows.length === 0) {
    return { ok: false, status: 400, msg: 'Token inválido o expirado.' };
  }

  const tokenId = tokRes.rows[0].id;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
  await pool.query('UPDATE otp_reset_tokens SET used = TRUE WHERE id = $1', [tokenId]);
  await revokeAllUserSessions(userId);

  return { ok: true, msg: RESET_SUCCESS_MSG };
}

module.exports = {
  requestOtp,
  verifyOtp,
  resetPasswordWithOtpToken,
  GENERIC_OTP_MSG,
  VERIFY_FAIL_MSG,
  RESET_SUCCESS_MSG,
};

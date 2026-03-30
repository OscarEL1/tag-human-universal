const crypto = require('crypto');
const pool = require('../config/db');
const { JWT_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_DAYS } = require('../config/authTokens');
const jwt = require('jsonwebtoken');

function hashRefreshToken(plain) {
  return crypto.createHash('sha256').update(plain, 'utf8').digest('hex');
}

function generateRefreshToken() {
  return crypto.randomBytes(32).toString('hex');
}

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

function refreshExpiresAtDate() {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_TOKEN_DAYS);
  return d;
}

/**
 * Crea una sesión nueva (multisesión: una fila por dispositivo/cliente).
 */
async function createSessionForUser(user, req) {
  const sessionId = crypto.randomUUID();
  const refreshToken = generateRefreshToken();
  const refreshHash = hashRefreshToken(refreshToken);
  const expiresAt = refreshExpiresAtDate();
  const userAgent = req.get('User-Agent') || null;

  await pool.query(
    `INSERT INTO user_sessions (id, user_id, refresh_token_hash, user_agent, refresh_expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [sessionId, user.id, refreshHash, userAgent, expiresAt]
  );

  const accessToken = signAccessToken({
    id: user.id,
    role: user.role,
    zone_id: user.zone_id,
    sid: sessionId,
  });

  return { sessionId, refreshToken, accessToken };
}

/**
 * Valida refresh actual, rota hash en BD (invalida el refresh anterior) y emite nuevos tokens.
 */
async function rotateRefreshToken(plainOldRefresh, req) {
  const oldHash = hashRefreshToken(plainOldRefresh);
  const newPlain = generateRefreshToken();
  const newHash = hashRefreshToken(newPlain);
  const newExpires = refreshExpiresAtDate();
  const userAgent = req.get('User-Agent') || null;

  const upd = await pool.query(
    `UPDATE user_sessions
     SET refresh_token_hash = $1,
         refresh_expires_at = $2,
         user_agent = COALESCE($3, user_agent)
     WHERE refresh_token_hash = $4
       AND revoked_at IS NULL
       AND refresh_expires_at > NOW()
     RETURNING id, user_id`,
    [newHash, newExpires, userAgent, oldHash]
  );

  if (upd.rows.length === 0) return null;

  const { id: sessionId, user_id: userId } = upd.rows[0];
  const userRow = await pool.query(
    'SELECT id, nombre, role, zone_id, plates FROM users WHERE id = $1',
    [userId]
  );
  if (userRow.rows.length === 0) return null;
  const u = userRow.rows[0];

  const accessToken = signAccessToken({
    id: u.id,
    role: u.role,
    zone_id: u.zone_id,
    sid: sessionId,
  });

  return {
    accessToken,
    refreshToken: newPlain,
    user: {
      id: u.id,
      nombre: u.nombre,
      role: u.role,
      zone_id: u.zone_id,
      plates: u.plates || null,
    },
  };
}

async function assertSessionActive(sessionId, userId) {
  const res = await pool.query(
    `SELECT id FROM user_sessions
     WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL AND refresh_expires_at > NOW()`,
    [sessionId, userId]
  );
  return res.rows.length > 0;
}

async function revokeSession(sessionId, userId) {
  const r = await pool.query(
    `UPDATE user_sessions SET revoked_at = NOW()
     WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL
     RETURNING id`,
    [sessionId, userId]
  );
  return r.rowCount > 0;
}

async function revokeAllUserSessions(userId) {
  await pool.query(
    `UPDATE user_sessions SET revoked_at = NOW()
     WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
}

async function listSessionsForUser(userId) {
  const res = await pool.query(
    `SELECT id, user_agent, created_at, refresh_expires_at, revoked_at
     FROM user_sessions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId]
  );
  return res.rows;
}

module.exports = {
  hashRefreshToken,
  generateRefreshToken,
  signAccessToken,
  createSessionForUser,
  rotateRefreshToken,
  assertSessionActive,
  revokeSession,
  revokeAllUserSessions,
  listSessionsForUser,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_DAYS,
};

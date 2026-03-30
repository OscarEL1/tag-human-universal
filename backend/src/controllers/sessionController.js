const pool = require('../config/db');
const {
  rotateRefreshToken,
  revokeSession,
  revokeAllUserSessions,
  listSessionsForUser,
} = require('../services/sessionService');

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(400).json({ msg: 'Se requiere refreshToken' });
  }

  try {
    const rotated = await rotateRefreshToken(refreshToken, req);
    if (!rotated) {
      return res.status(401).json({ msg: 'Refresh inválido o sesión revocada/expirada' });
    }

    return res.json({
      msg: 'Token renovado',
      accessToken: rotated.accessToken,
      token: rotated.accessToken,
      refreshToken: rotated.refreshToken,
      user: rotated.user,
    });
  } catch (e) {
    console.error('refresh:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

const logout = async (req, res) => {
  try {
    await revokeSession(req.sessionId, req.user.id);
    return res.json({ msg: 'Sesión cerrada' });
  } catch (e) {
    console.error('logout:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

const logoutAll = async (req, res) => {
  try {
    await revokeAllUserSessions(req.user.id);
    return res.json({ msg: 'Todas las sesiones cerradas' });
  } catch (e) {
    console.error('logoutAll:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

const sessions = async (req, res) => {
  try {
    const rows = await listSessionsForUser(req.user.id);
    const currentSid = req.sessionId;
    const list = rows.map((r) => ({
      id: r.id,
      userAgent: r.user_agent,
      createdAt: r.created_at,
      refreshExpiresAt: r.refresh_expires_at,
      revokedAt: r.revoked_at,
      isCurrent: r.id === currentSid && !r.revoked_at,
    }));
    return res.json({ sessions: list });
  } catch (e) {
    console.error('sessions:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

const revokeOne = async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ msg: 'Falta sessionId' });
  try {
    if (sessionId === req.sessionId) {
      return res.status(400).json({ msg: 'Usa POST /auth/logout para cerrar la sesión actual' });
    }
    const ok = await revokeSession(sessionId, req.user.id);
    if (!ok) return res.status(404).json({ msg: 'Sesión no encontrada' });
    return res.json({ msg: 'Sesión revocada' });
  } catch (e) {
    console.error('revokeOne:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

module.exports = { refresh, logout, logoutAll, sessions, revokeOne };

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/authTokens');
const { assertSessionActive } = require('../services/sessionService');

/**
 * Valida access JWT + que la sesión (sid) siga activa en PostgreSQL.
 */
module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7, authHeader.length)
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.sid) {
      return res.status(401).json({ msg: 'Token sin sesión. Inicia sesión de nuevo.' });
    }

    const active = await assertSessionActive(decoded.sid, decoded.id);
    if (!active) {
      return res.status(401).json({ msg: 'Sesión revocada o expirada.' });
    }

    req.user = decoded;
    req.sessionId = decoded.sid;
    next();
  } catch {
    res.status(401).json({ msg: 'Token no válido o expirado.' });
  }
};

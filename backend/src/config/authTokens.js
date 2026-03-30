require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_unified_secret_change_in_production';

/** Duración del access token (JWT corto). Ej: 15m, 1h */
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';

/** Vida del refresh token en la BD (días) */
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);

module.exports = {
  JWT_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_DAYS,
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto_temporal';

module.exports = (req, res, next) => {
  // 1. Obtener el token del Header (Esperamos: "Bearer <token>")
  const authHeader = req.header('Authorization');

  // Si no hay header, bloqueo inmediato 🛑
  if (!authHeader) {
    return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });
  }

  // 2. Limpiar el token (Quitar la palabra "Bearer " si viene)
  // A veces el frontend manda "Bearer eyJhb...", a veces solo "eyJhb..."
  const token = authHeader.startsWith('Bearer ') 
                ? authHeader.slice(7, authHeader.length) 
                : authHeader;

  try {
    // 3. Verificar la firma del Token ✍️
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. ¡Éxito! Guardamos los datos del usuario en la petición
    // Esto es CLAVE: Ahora cualquier controlador siguiente podrá usar req.user
    req.user = decoded;

    // 5. Dejar pasar al siguiente controlador 🟢
    next();

  } catch (error) {
    res.status(401).json({ msg: 'Token no válido o expirado.' });
  }
};
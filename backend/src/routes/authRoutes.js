const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware'); // <--- AÑADIR ESTO ARRIBA

// Middleware para revisar errores de validación
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- RUTA: POST /api/auth/register ---
router.post('/register', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('phone', 'El teléfono debe ser de 10 dígitos').isLength({ min: 10, max: 10 }),
  check('password', 'La contraseña debe tener 6+ caracteres').isLength({ min: 6 }),
  
  // REQUERIMIENTO DEL TICKET: Regex de Placas
  // Validamos solo si el rol es 'driver'. Formato flexible (Letras y Números)
  check('plates')
    .if((value, { req }) => req.body.role === 'driver')
    .matches(/^[A-Z0-9-]{6,10}$/i)
    .withMessage('Formato de placas inválido (Solo letras, números y guiones)'),
  
  validarCampos
], register);

// --- RUTA: POST /api/auth/login ---
router.post('/login', [
  check('phone', 'El teléfono es obligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], login);

// --- RUTA PROTEGIDA DE PRUEBA: GET /api/auth/me ---
// Esta ruta devuelve los datos del usuario SOLO si manda el token correcto
router.get('/me', auth, async (req, res) => {
  try {
    // Buscamos al usuario en la BD usando el ID que venía en el token
    // Nota: req.user.id viene del middleware que acabamos de hacer
    const pool = require('../config/db'); // Importación rápida para el ejemplo
    
    const user = await pool.query('SELECT id, nombre, phone, role FROM users WHERE id = $1', [req.user.id]);
    
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
});
module.exports = router;
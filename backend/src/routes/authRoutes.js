const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');

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

module.exports = router;
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { refresh, logout, logoutAll, sessions, revokeOne } = require('../controllers/sessionController');
const { recover, resetPassword } = require('../controllers/recoveryController');
const {
  requestOtpHandler,
  verifyOtpHandler,
  resetPasswordOtpHandler,
} = require('../controllers/otpRecoveryController');
const auth = require('../middlewares/authMiddleware');

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/register', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('phone', 'El teléfono debe ser de 10 dígitos').isLength({ min: 10, max: 10 }),
  check('password', 'La contraseña debe tener 6+ caracteres').isLength({ min: 6 }),
  check('plates')
    .if((value, { req }) => req.body.role === 'driver')
    .not()
    .isEmpty()
    .withMessage('Las placas son obigatorias para conductores')
    .matches(/^[A-Z0-9-]{5,10}$/i)
    .withMessage('Formato de placas inválido (Solo letras, números y guiones)'),
  validarCampos,
], register);

router.post('/login', [
  check('phone', 'El teléfono es obligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos,
], login);

router.post('/refresh', refresh);
router.post('/logout', auth, logout);
router.post('/logout-all', auth, logoutAll);
router.get('/sessions', auth, sessions);
router.delete('/sessions/:sessionId', auth, revokeOne);

router.post('/recover', [
  check('phone', 'El teléfono debe ser de 10 dígitos').isLength({ min: 10, max: 10 }),
  validarCampos,
], recover);

router.post('/reset-password', [
  check('phone', 'El teléfono debe ser de 10 dígitos').isLength({ min: 10, max: 10 }),
  check('token', 'Token obligatorio').not().isEmpty(),
  check('password', 'La contraseña debe tener 6+ caracteres').isLength({ min: 6 }),
  validarCampos,
], resetPassword);

router.post('/request-otp', [
  check('phone', 'El teléfono debe ser de 10 dígitos').isLength({ min: 10, max: 10 }),
  validarCampos,
], requestOtpHandler);

router.post('/verify-otp', [
  check('phone', 'El teléfono debe ser de 10 dígitos').isLength({ min: 10, max: 10 }),
  check('code', 'El código debe ser de 6 dígitos').matches(/^\d{6}$/),
  validarCampos,
], verifyOtpHandler);

router.post('/reset-password-otp', [
  check('phone', 'El teléfono debe ser de 10 dígitos').isLength({ min: 10, max: 10 }),
  check('resetToken', 'Token obligatorio').not().isEmpty(),
  check('newPassword', 'La contraseña debe tener 6+ caracteres').isLength({ min: 6 }),
  validarCampos,
], resetPasswordOtpHandler);

router.get('/me', auth, async (req, res) => {
  try {
    const pool = require('../config/db');
    const user = await pool.query(
      'SELECT id, nombre, phone, role, zone_id, plates FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!user.rows[0]) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

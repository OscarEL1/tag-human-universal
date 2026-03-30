const {
  requestOtp,
  verifyOtp,
  resetPasswordWithOtpToken,
} = require('../services/otpRecoveryService');

/**
 * POST /api/auth/request-otp
 * Respuesta uniforme para no filtrar existencia de usuario (ver servicio).
 */
const requestOtpHandler = async (req, res) => {
  const { phone } = req.body;
  try {
    const data = await requestOtp(phone);
    return res.status(200).json(data);
  } catch (e) {
    console.error('requestOtpHandler:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

const verifyOtpHandler = async (req, res) => {
  const { phone, code } = req.body;
  try {
    const result = await verifyOtp(phone, code);
    if (!result.ok) {
      return res.status(400).json({ msg: result.msg });
    }
    return res.json({ resetToken: result.resetToken });
  } catch (e) {
    console.error('verifyOtpHandler:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

const resetPasswordOtpHandler = async (req, res) => {
  const { phone, resetToken, newPassword } = req.body;
  try {
    const result = await resetPasswordWithOtpToken(phone, resetToken, newPassword);
    if (!result.ok) {
      return res.status(result.status).json({ msg: result.msg });
    }
    return res.json({ msg: result.msg });
  } catch (e) {
    console.error('resetPasswordOtpHandler:', e);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

module.exports = {
  requestOtpHandler,
  verifyOtpHandler,
  resetPasswordOtpHandler,
};

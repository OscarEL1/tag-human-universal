import { loginUser, requestPasswordRecover, resetPasswordWithToken } from '../api/auth';

function sanitizePhone(phone) {
  return String(phone || '').replace(/\D/g, '').slice(0, 10);
}

function sanitizeToken(token) {
  return String(token || '').trim();
}

export async function login(credentials) {
  return loginUser({
    phone: sanitizePhone(credentials.phone),
    password: String(credentials.password || ''),
  });
}

export async function recoverPassword(phone) {
  return requestPasswordRecover(sanitizePhone(phone));
}

export async function resetPassword(payload) {
  return resetPasswordWithToken({
    phone: sanitizePhone(payload.phone),
    token: sanitizeToken(payload.token),
    password: String(payload.password || ''),
  });
}

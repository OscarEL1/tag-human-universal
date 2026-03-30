export const API_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD
      ? "https://tag-human-backend.onrender.com/api"
      : "http://localhost:3000/api");

function makeError(message, status) {
  const e = new Error(message);
  e.status = status;
  return e;
}

export function parseJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    return JSON.parse(atob(b64 + pad));
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token, skewSec = 15) {
  const p = parseJwtPayload(token);
  if (!p?.exp) return true;
  return p.exp * 1000 <= Date.now() + skewSec * 1000;
}

export async function apiRefresh(refreshToken) {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw makeError(data.msg || 'No se pudo renovar la sesi�n', res.status);
  return data;
}

export async function apiMe(accessToken) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw makeError('Sesi�n inv�lida', res.status);
  return res.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw makeError(data.msg || 'Error al iniciar sesi�n', response.status);
  return data;
}

export async function requestPasswordRecover(phone) {
  const res = await fetch(`${API_URL}/auth/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw makeError(data.msg || 'Solicitud no procesada', res.status);
  return data;
}

export async function resetPasswordWithToken({ phone, token, password }) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, token, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw makeError(data.msg || 'No se pudo restablecer', res.status);
  return data;
}

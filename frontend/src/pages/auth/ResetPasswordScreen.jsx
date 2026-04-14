import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../../services/authService';
import PageTransition from '../../components/shared/PageTransition';

function sanitizePhoneInput(value) {
  return value.replace(/\D/g, '').slice(0, 10);
}

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState(location.state?.phone ? sanitizePhoneInput(location.state.phone) : '');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const phoneRef = useRef(null);

  useEffect(() => {
    phoneRef.current?.focus();
  }, []);

  const formValid = useMemo(() => {
    return /^\d{10}$/.test(phone)
      && token.trim().length > 0
      && password.length >= 6
      && confirmPassword === password;
  }, [phone, token, password, confirmPassword]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(phone)) {
      setError('Ingresa un tel�fono v�lido de 10 d�gitos.');
      return;
    }
    if (password.length < 6) {
      setError('La contrase�a debe tener al menos 6 caracteres.');
      return;
    }
    if (confirmPassword !== password) {
      setError('La confirmaci�n no coincide.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ phone, token, password });
      setSuccess(true);
      setTimeout(() => {
        // Backend revoca sesiones al cambiar contrase�a; limpiamos estado local para evitar inconsistencias UI.
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/');
      }, 1800);
    } catch (err) {
      if (err?.status === 400 || err?.status === 401) {
        setError('Token inv�lido o expirado');
      } else {
        setError('No se pudo cambiar la contrase�a');
      }
    } finally {
      setLoading(false);
    }
  };

  return (

    <PageTransition>
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#1A1A1A]">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate('/recover-password', { state: { phone } })}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <h1 className="text-2xl font-bold text-[#1A1A1A]">Restablecer contrase�a</h1>
        <p className="text-sm text-gray-500 mt-2">Ingresa tel�fono, token y tu nueva contrase�a.</p>

        <form onSubmit={onSubmit} className="space-y-4 mt-6" noValidate>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-center gap-2" role="alert">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded flex items-center gap-2" role="status" aria-live="polite">
              <CheckCircle2 className="text-green-600 shrink-0" size={18} />
              <p className="text-green-700 text-sm font-medium">Contrase�a actualizada. Redirigiendo�</p>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="reset-phone" className="text-sm font-semibold text-gray-700">Tel�fono</label>
            <input
              ref={phoneRef}
              id="reset-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
              className="w-full h-11 px-4 rounded-lg border-2 border-gray-100 bg-gray-50 focus:border-[#0052CC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] text-black"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reset-token" className="text-sm font-semibold text-gray-700">Token de recuperaci�n</label>
            <input
              id="reset-token"
              type="text"
              autoComplete="one-time-code"
              value={token}
              onChange={(e) => setToken(e.target.value.trim())}
              className="w-full h-11 px-4 rounded-lg border-2 border-gray-100 bg-gray-50 focus:border-[#0052CC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] text-black"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reset-password" className="text-sm font-semibold text-gray-700">Nueva contrase�a</label>
            <input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border-2 border-gray-100 bg-gray-50 focus:border-[#0052CC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] text-black"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reset-confirm" className="text-sm font-semibold text-gray-700">Confirmar contrase�a</label>
            <input
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border-2 border-gray-100 bg-gray-50 focus:border-[#0052CC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formValid}
            className="w-full h-12 bg-[#0052CC] hover:bg-[#0065FF] disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <><Loader2 className="animate-spin size-5" /><span>Procesando...</span></> : 'Cambiar contrase�a'}
          </button>

          <div className="text-center text-sm text-gray-500">
            �No tienes token?{' '}
            <Link to="/recover-password" className="text-[#0052CC] font-semibold hover:underline">
              Solicitar recuperaci�n
            </Link>
          </div>
        </form>
      </div>
    </main>
    </PageTransition>
  );
}

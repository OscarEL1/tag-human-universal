import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { recoverPassword } from '../../services/authService';
import PageTransition from '../../components/shared/PageTransition';

const GENERIC_RECOVER_MESSAGE = 'Si el n�mero est� registrado, recibir�s instrucciones';

function sanitizePhoneInput(value) {
  return value.replace(/\D/g, '').slice(0, 10);
}

export default function RecoverPasswordScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const phoneInputRef = useRef(null);

  useEffect(() => {
    phoneInputRef.current?.focus();
  }, []);

  const isPhoneValid = useMemo(() => /^\d{10}$/.test(phone), [phone]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPhoneValid) {
      setError('Ingresa un tel�fono v�lido de 10 d�gitos.');
      return;
    }

    setLoading(true);
    try {
      await recoverPassword(phone);
      setSuccess(true);
    } catch {
      // UX: no revelar informaci�n sensible; mantenemos el mismo mensaje gen�rico.
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1A1A1A]">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <h1 className="text-2xl font-bold text-[#1A1A1A]">Recuperar contrase�a</h1>
        <p className="text-sm text-gray-500 mt-2">Ingresa tu tel�fono para solicitar recuperaci�n.</p>

        <form onSubmit={onSubmit} className="space-y-5 mt-6" noValidate>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-center gap-2" role="alert">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded flex items-center gap-2" role="status" aria-live="polite">
              <CheckCircle2 className="text-green-600 shrink-0" size={18} />
              <p className="text-green-700 text-sm font-medium">{GENERIC_RECOVER_MESSAGE}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="recover-phone" className="block text-sm font-semibold text-gray-700">Tel�fono</label>
            <input
              ref={phoneInputRef}
              id="recover-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
              placeholder="10 d�gitos"
              className={`w-full h-12 px-4 rounded-lg border-2 outline-none text-black ${error ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-[#0052CC]'}`}
              aria-invalid={Boolean(error)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#0052CC] hover:bg-[#0065FF] disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <><Loader2 className="animate-spin size-5" /><span>Enviando...</span></> : 'Enviar solicitud'}
          </button>

          <div className="text-center text-sm text-gray-500">
            �Ya tienes token?{' '}
            <Link
              to="/reset-password"
              state={{ phone }}
              className="text-[#0052CC] font-semibold hover:underline"
            >
              Restablecer ahora
            </Link>
          </div>
        </form>
      </div>
    </div>
    </PageTransition>
  );
}

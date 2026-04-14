import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../api/auth';
import PageTransition from '../../components/shared/PageTransition';

/**
 * Pantalla "Decisión de Acceso"
 * Muestra foto del repartidor (placeholder), placas del vehículo y botón Autorizar.
 * Wired to POST /api/auditoria/registrar — requiere auth token en localStorage.
 */
const DecisionAcceso = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success' | 'error', msg: string }

  // En la integración real, estos valores llegarían por props/route desde GuardScanner
  const plate = 'ABC-1234';
  const destino = 'N/A';

  const handleAutorizar = async () => {
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      const res = await fetch(`${API_URL}/auditoria/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quien_entra: plate,
          quien_autoriza: currentUser.id ?? null,
          destino,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.msg || 'Error al registrar el acceso');

      setResult({ type: 'success', msg: 'Acceso autorizado y registrado correctamente' });
    } catch (err) {
      setResult({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-[#1A1A1A] text-white px-6 py-8 flex flex-col">
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center" role="main" aria-labelledby="titulo-acceso">
        <h1 id="titulo-acceso" className="text-2xl font-bold text-center mb-8">
          Decisión de Acceso
        </h1>

        {/* Foto del repartidor (placeholder) */}
        <section className="flex flex-col items-center mb-8" aria-label="Datos del repartidor">
          <div
            className="w-32 h-32 rounded-2xl bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600 shrink-0"
            role="img"
            aria-label="Foto del repartidor (placeholder)"
          >
            <User className="w-16 h-16 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-gray-400 text-sm mt-3">Repartidor verificado</p>
        </section>

        {/* Placas del vehículo */}
        <section className="bg-gray-800 p-5 rounded-2xl border border-gray-600 mb-8" aria-labelledby="label-placas">
          <p id="label-placas" className="text-gray-400 text-xs uppercase font-bold mb-1">
            Placas del vehículo
          </p>
          <p className="text-2xl font-black tracking-widest font-mono" aria-label={`Placas ${plate}`}>
            {plate}
          </p>
        </section>

        {/* Feedback del servidor */}
        {result && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-300 ${
              result.type === 'success'
                ? 'bg-green-900/40 border border-green-700 text-green-300'
                : 'bg-red-900/40 border border-red-700 text-red-300'
            }`}
            role="alert"
          >
            {result.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{result.msg}</p>
          </div>
        )}

        {/* Botón Autorizar */}
        <Button
          type="button"
          onClick={handleAutorizar}
          disabled={loading || result?.type === 'success'}
          variant="default"
          size="lg"
          className="w-full bg-[var(--action-blue)] hover:opacity-90 focus-visible:ring-3 focus-visible:ring-blue-300 disabled:opacity-50 flex items-center justify-center gap-2"
          aria-label="Autorizar acceso del repartidor"
        >
          {loading ? (
            <><Loader2 className="animate-spin w-5 h-5" aria-hidden="true" /><span aria-live="assertive">Registrando...</span></>
          ) : (
            'Autorizar'
          )}
        </Button>
      </main>
    </div>
    </PageTransition>
  );
};

export default DecisionAcceso;

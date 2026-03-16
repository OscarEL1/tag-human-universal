import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, ArrowLeft, RefreshCcw, Loader2, AlertCircle } from 'lucide-react';
import { API_URL } from '../../api/auth';

const RegisterStep2 = ({ onBack, onFinish, userData }) => {
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const captureBtnRef = useRef(null);

  useEffect(() => {
    captureBtnRef.current?.focus();
  }, []);

  const handleFinalRegister = async () => {

    if(!userData) {
      setError("Error interno: Los datos del registro se perdieron. Por favor regresa al paso anterior. ");
      return;
    }
    setLoading(true);
    setError(null);
    try {
    // 2. Construcción Segura (Evita el error de 'reading nombre')
    const payload = {
      nombre: userData.nombre || "",
      phone: userData.phone || "",
      password: userData.password || "",
      plates: userData.plates ? userData.plates.toUpperCase().trim() : "",
      role: 'driver'
    };

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

      if (!response.ok) {
        // Si el backend regresa el array de "errors" que me mostraste:
      const errorMsg = result.errors ? result.errors[0].msg : (result.msg || "Error en el registro");
        throw new Error(errorMsg);
      }

      // Guardamos el token para sesión automática
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      onFinish(); // Navega al Dashboard/QR
      
    } catch (err) {
      console.log("Detalle del error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <header className="flex items-center mb-8">
        <button onClick={onBack} disabled={loading} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="ml-4 text-2xl font-bold text-black">Identidad</h1>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Progreso 100% */}
        <div className="w-full mb-8">
          <div className="flex justify-between mb-2 text-xs font-bold text-gray-500 uppercase">
            <span>Paso Final: Foto</span>
            <span>100%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-green-500 rounded-full" />
          </div>
        </div>

        {/* Error de Red Accesible */}
        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center gap-3 animate-in fade-in" role="alert">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Visor de Cámara */}
        <div 
          className={`w-full aspect-square max-w-xs rounded-[3rem] border-4 flex flex-col items-center justify-center transition-all shadow-xl relative
            ${captured ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-200 bg-gray-50'}`}
        >
          {loading ? (
            <Loader2 className="w-12 h-12 text-[#0052CC] animate-spin" />
          ) : captured ? (
            <Check className="w-20 h-20 text-green-500 animate-bounce" />
          ) : (
            <Camera className="w-16 h-16 text-gray-300" />
          )}
          
          {captured && !loading && (
            <div className="absolute -bottom-4 bg-green-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">Capturado</div>
          )}
        </div>

        <button
          ref={captureBtnRef}
          onClick={() => {
            setLoading(true);
            setTimeout(() => { setCaptured(true); setLoading(false); }, 1000);
          }}
          disabled={loading}
          className={`mt-10 p-6 rounded-full transition-all outline-none focus:ring-4 shadow-lg active:scale-90
            ${captured ? 'bg-gray-100 text-gray-500' : 'bg-[#0052CC] text-white hover:bg-blue-700 focus:ring-blue-200'}`}
        >
          {captured ? <RefreshCcw size={32} /> : <Camera size={32} />}
        </button>

        <p className="mt-6 text-sm font-bold text-gray-400" aria-live="polite">
          {loading ? "Procesando..." : captured ? "Foto lista para el perfil" : "Centra tu rostro y captura"}
        </p>
      </main>

      <button
        onClick={handleFinalRegister}
        disabled={!captured || loading}
        className="mt-auto w-full h-16 bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:bg-gray-200 shadow-xl active:scale-95 transition-all"
      >
        {loading ? (
          <><Loader2 className="animate-spin" /> <span aria-live="assertive">Creando cuenta...</span></>
        ) : (
          "FINALIZAR REGISTRO"
        )}
      </button>
    </div>
  );
};

export default RegisterStep2;
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, ArrowLeft, RefreshCcw, Loader2 } from 'lucide-react';

const RegisterStep2 = ({ onBack, onFinish }) => {
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const captureBtnRef = useRef(null);

  useEffect(() => {
    captureBtnRef.current?.focus();
  }, []);

  const handleCapture = () => {
    setLoading(true);
    // Simulación de procesamiento de imagen (Event-driven UI)
    setTimeout(() => {
      setCaptured(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#0052CC]">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="ml-4 text-2xl font-bold text-black">Verificación</h1>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <div className="mb-8" aria-label="Progreso: paso 2 de 2" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
          <div className="flex justify-between mb-2 text-sm font-bold text-gray-600">
            <span>Paso 2: Foto de Identidad</span>
            <span>100%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div className="w-full h-full bg-[#0052CC] rounded-full transition-all duration-500" />
          </div>
        </div>

        <div 
          className={`w-full aspect-square max-w-sm rounded-3xl border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-inner
            ${captured ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 bg-gray-50'}`}
          role="img" 
          aria-label={captured ? "Foto capturada correctamente" : "Visor de cámara vacío"}
        >
          {loading ? (
            <Loader2 className="w-16 h-16 text-[#0052CC] animate-spin" />
          ) : captured ? (
            <Check className="w-20 h-20 text-green-500 animate-bounce" />
          ) : (
            <Camera className="w-20 h-20 text-gray-300" />
          )}
        </div>

        <button
          ref={captureBtnRef}
          onClick={handleCapture}
          disabled={loading}
          className={`mt-10 p-6 rounded-full transition-all outline-none focus:ring-4 focus:ring-blue-200 
            ${captured ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-[#0052CC] hover:bg-gray-200'}`}
          aria-label={captured ? "Volver a tomar foto" : "Capturar fotografía de identidad"}
        >
          {captured ? <RefreshCcw size={32} /> : <Camera size={32} />}
        </button>

        <p className="mt-6 text-sm font-bold text-gray-500" aria-live="polite">
          {loading ? "Procesando imagen..." : captured ? "✅ Identidad verificada" : "Presiona el botón para capturar"}
        </p>
      </main>

      <button
        onClick={onFinish}
        disabled={!captured || loading}
        className="mt-auto w-full h-14 bg-[#0052CC] text-white font-bold rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-all"
      >
        {loading ? "Espere..." : "Finalizar Registro"}
      </button>
    </div>
  );
};

export default RegisterStep2;
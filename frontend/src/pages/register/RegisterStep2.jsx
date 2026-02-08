import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, ArrowLeft } from 'lucide-react';

const RegisterStep2 = ({ onBack, onFinish }) => {
  const [captured, setCaptured] = useState(false);
  const captureBtnRef = useRef(null);

  // Gestión de foco: Al entrar, el foco va directo a capturar foto
  useEffect(() => {
    captureBtnRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="ml-4 text-2xl font-bold">Verificación</h1>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <p className="text-gray-600 mb-8 text-center">Tómate una foto para validar tu identidad.</p>

        <div className={`w-full aspect-square max-w-sm rounded-2xl border-4 flex items-center justify-center transition-all ${
          captured ? 'border-[#00875A] bg-green-50' : 'border-dashed border-gray-300 bg-gray-50'
        }`}>
          {captured ? <Check className="w-20 h-20 text-[#00875A]" /> : <Camera className="w-20 h-20 text-gray-300" />}
        </div>

        <button
          ref={captureBtnRef}
          onClick={() => setCaptured(true)}
          className="mt-8 bg-gray-100 p-6 rounded-full hover:bg-gray-200 focus:ring-4 focus:ring-[#0052CC] outline-none"
          aria-label="Capturar fotografía"
        >
          <Camera className="w-8 h-8 text-[#0052CC]" />
        </button>

        {/* Mensaje aria-live para feedback instantáneo */}
        <p className="mt-4 text-sm font-medium text-gray-500" aria-live="polite">
          {captured ? "✅ Foto capturada correctamente" : "Esperando captura..."}
        </p>
      </main>

      <button
        onClick={onFinish}
        disabled={!captured}
        className="mt-auto w-full h-12 bg-[#0052CC] text-white font-bold rounded-lg disabled:bg-gray-300 transition-colors"
      >
        Finalizar Registro
      </button>
    </div>
  );
};

export default RegisterStep2;
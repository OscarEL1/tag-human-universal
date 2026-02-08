import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const RegisterStep1 = ({ onNext, onBack, initialData }) => {
  const firstInputRef = useRef(null);

  // Gestión de foco: Al cargar la pantalla, el cursor va al nombre
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onNext(Object.fromEntries(formData));
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="ml-4 text-2xl font-bold">Crear cuenta</h1>
      </header>

      {/* Indicador de progreso accesible */}
      <div className="mb-8" aria-label="Progreso de registro: paso 1 de 2" role="img">
        <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
          <span>Paso 1 de 2</span>
          <span>50%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div className="w-1/2 h-full bg-[#0052CC] rounded-full transition-all duration-500" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
          <input
            ref={firstInputRef}
            name="nombre"
            id="nombre"
            required
            defaultValue={initialData?.nombre}
            placeholder="Ej. Juan Pérez"
            className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-100 rounded-lg focus:border-[#0052CC] outline-none transition-all text-black"
          />
        </div>

        <div>
          <label htmlFor="plates" className="block text-sm font-semibold text-gray-700 mb-2">Número de placa *</label>
          <input
            name="plates"
            id="plates"
            required
            defaultValue={initialData?.plates}
            placeholder="ABC-1234"
            className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-100 rounded-lg focus:border-[#0052CC] outline-none transition-all text-black uppercase"
          />
        </div>

        <button type="submit" className="mt-auto w-full h-12 bg-[#0052CC] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#0065FF]">
          Siguiente paso <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default RegisterStep1;
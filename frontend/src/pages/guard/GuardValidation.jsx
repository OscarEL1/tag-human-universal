import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Home, ArrowLeft, User } from 'lucide-react';
import { Button } from '../../components/ui/Button'; // <-- Nota las llaves

const GuardValidation = ({ driverData, onAuthorize, onReject, onBack }) => {
  const houseInputRef = useRef(null);

  // Gestión de Foco: El guardia no debe hacer clic, solo escribir el número de casa
  useEffect(() => {
    houseInputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onAuthorize(formData.get('houseNumber'));
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Regresar al escáner"
        >
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="ml-4 text-2xl font-bold text-black">Validación</h1>
      </header>

      {/* Foto Gigante (40% de la pantalla para comparación rápida) */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border-4 border-gray-200 mb-6 shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <User className="w-32 h-32 text-gray-300" />
          {/* Aquí se mostraría la foto real del backend */}
        </div>
        <div className="absolute top-4 right-4 bg-success-green text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <CheckCircle className="w-4 h-4" /> VERIFICADO
        </div>
      </div>

      {/* Info del Repartidor */}
      <section className="space-y-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-gray-500 text-xs uppercase font-bold mb-1">Conductor</p>
          <p className="text-xl font-bold text-black">{driverData.nombre || "Juan Pérez"}</p>
        </div>

        <div className="bg-black p-4 rounded-xl shadow-inner">
          <p className="text-gray-400 text-xs uppercase font-bold mb-1">Placas</p>
          <p className="text-2xl font-black text-white tracking-widest font-mono">
            {driverData.plates || "ABC-1234"}
          </p>
        </div>
      </section>

      {/* Formulario de Casa Destino */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="mb-8">
          <label htmlFor="houseNumber" className="block text-sm font-bold text-gray-700 mb-2">
            Casa de destino #
          </label>
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={houseInputRef}
              name="houseNumber"
              id="houseNumber"
              type="number"
              required
              placeholder="Ej. 45"
              className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-xl font-bold focus:border-action-blue outline-none transition-all text-black"
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">Pregunte al repartidor a qué domicilio se dirige.</p>
        </div>

        {/* Acciones Finales */}
        <div className="mt-auto space-y-3">
          <Button type="submit">
            <CheckCircle className="w-5 h-5" /> AUTORIZAR ENTRADA
          </Button>
          
          <button
            type="button"
            onClick={onReject}
            className="w-full h-12 text-error-red font-bold hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" /> Rechazar Acceso
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuardValidation;
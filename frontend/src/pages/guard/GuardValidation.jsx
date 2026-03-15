import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Home, ArrowLeft, User, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const GuardValidation = ({ driverData, onAuthorize, onReject, onBack }) => {
  const houseInputRef = useRef(null);
  const isExit = driverData.mode === 'exit'; // Detectamos el modo automáticamente

  // Gestión de Foco: Solo enfocamos si es entrada y hay que escribir la casa
  useEffect(() => {
    if (!isExit) {
      houseInputRef.current?.focus();
    }
  }, [isExit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isExit) {
      onAuthorize('N/A'); // En salida no hay casa
    } else {
      const formData = new FormData(e.target);
      onAuthorize(formData.get('houseNumber'));
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#0052CC]">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="ml-4 text-2xl font-bold text-black">
          {isExit ? 'Validar Salida' : 'Validar Entrada'}
        </h1>
      </header>

      {/* Foto Ajustada: Más pequeña y profesional (Tipo ID) */}
      <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="size-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-tighter">Conductor Verificado</p>
          <p className="text-lg font-black text-black leading-tight">{driverData.name || "Juan Pérez"}</p>
          <div className="flex items-center gap-1 mt-1 text-green-600">
            <CheckCircle size={14} fill="currentColor" className="text-white" />
            <span className="text-[10px] font-bold uppercase">Identidad TAG-H OK</span>
          </div>
        </div>
      </div>

      <section className="space-y-4 mb-8">
        <div className="bg-black p-5 rounded-2xl shadow-xl border-b-4 border-blue-900">
          <p className="text-gray-400 text-xs uppercase font-bold mb-1">Placas del Vehículo</p>
          <p className="text-3xl font-black text-white tracking-[0.2em] font-mono">
            {driverData.plate || "ABC-1234"}
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Lógica Condicional: Ocultamos el input si es Salida */}
        {!isExit ? (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
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
                inputMode="numeric"
                required
                placeholder="Ej. 45"
                className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-xl font-bold focus:border-[#0052CC] outline-none transition-all text-black shadow-inner"
              />
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in zoom-in duration-300">
            <p className="text-blue-700 text-sm font-bold flex items-center gap-2">
              <LogOut size={18} /> Confirmando salida de recinto seguro.
            </p>
          </div>
        )}

        <div className="mt-auto space-y-3">
          <Button 
            type="submit" 
            className={isExit ? "bg-blue-600 hover:bg-blue-700" : "bg-[#00875A] hover:bg-[#006644]"}
          >
            {isExit ? "CONFIRMAR SALIDA EXITOSA" : "AUTORIZAR ENTRADA"}
          </Button>
          
          <button
            type="button"
            onClick={onReject}
            className="w-full h-12 text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-red-200"
          >
            <XCircle className="w-5 h-5" /> Cancelar Operación
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuardValidation;
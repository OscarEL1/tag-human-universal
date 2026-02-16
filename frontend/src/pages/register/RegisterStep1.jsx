import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, ChevronRight, AlertCircle, User, Car } from 'lucide-react';

// Esquema de validación: Resiliencia en el formato de datos
const step1Schema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  plates: z.string()
    .min(6, "Placa inválida")
    .max(8, "Placa demasiado larga")
    .regex(/^[A-Z0-9-]+$/, "Solo letras y números (puedes usar guion)"),
});

const RegisterStep1 = ({ onNext, onBack, initialData }) => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: initialData
  });

  // Gestión de Foco: Event-driven UI al montar el componente
  useEffect(() => {
    setFocus("nombre");
  }, [setFocus]);

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#0052CC]">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="ml-4 text-2xl font-bold text-black">Crear cuenta</h1>
      </header>

      {/* Progreso accesible */}
      <div className="mb-8" aria-label="Progreso: paso 1 de 2" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
        <div className="flex justify-between mb-2 text-sm font-bold text-gray-600">
          <span>Paso 1: Información</span>
          <span>50%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div className="w-1/2 h-full bg-[#0052CC] rounded-full transition-all duration-500" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="flex-1 flex flex-col space-y-6" noValidate>
        {/* Campo Nombre */}
        <div className="space-y-2">
          <label htmlFor="nombre" className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <User size={16} /> Nombre completo *
          </label>
          <input
            {...register("nombre")}
            id="nombre"
            placeholder="Ej. Juan Pérez"
            aria-invalid={errors.nombre ? "true" : "false"}
            className={`w-full h-14 px-4 bg-gray-50 border-2 rounded-xl outline-none transition-all text-black font-medium
              ${errors.nombre ? 'border-red-500 focus:border-red-600' : 'border-gray-100 focus:border-[#0052CC]'}`}
          />
          {errors.nombre && (
            <p className="text-red-600 text-xs font-bold flex items-center gap-1" role="alert">
              <AlertCircle size={14} /> {errors.nombre.message}
            </p>
          )}
        </div>

        {/* Campo Placas */}
        <div className="space-y-2">
          <label htmlFor="plates" className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Car size={16} /> Número de placa *
          </label>
          <input
            {...register("plates")}
            id="plates"
            placeholder="ABC-1234"
            style={{ textTransform: 'uppercase' }}
            aria-invalid={errors.plates ? "true" : "false"}
            className={`w-full h-14 px-4 bg-gray-50 border-2 rounded-xl outline-none transition-all text-black font-bold tracking-widest
              ${errors.plates ? 'border-red-500 focus:border-red-600' : 'border-gray-100 focus:border-[#0052CC]'}`}
          />
          {errors.plates && (
            <p className="text-red-600 text-xs font-bold flex items-center gap-1" role="alert">
              <AlertCircle size={14} /> {errors.plates.message}
            </p>
          )}
        </div>

        <button type="submit" className="mt-auto w-full h-14 bg-[#0052CC] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#0065FF] active:scale-95 transition-transform shadow-lg outline-none focus:ring-4 focus:ring-blue-200">
          Siguiente paso <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default RegisterStep1;
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, ChevronRight, AlertCircle, User, Car, Smartphone, Lock } from 'lucide-react';

// Esquema robusto: Validamos todo antes del paso final
const step1Schema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  phone: z.string()
    .min(10, "El teléfono debe tener 10 dígitos")
    .max(10, "El teléfono debe tener 10 dígitos")
    .regex(/^\d+$/, "Solo números"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  plates: z.string()
    .trim() // limpia espacios al inicio/final
    .toUpperCase() // Convierte a mayusculas
    .min(6, "Placa demasiado corta")
    .max(10, "Placa demasiado larga")
    .regex(/^[A-Z0-9]+$/, "Solo se permiten letras y números en mayusculas"),
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

  useEffect(() => {
    setFocus("nombre");
  }, [setFocus]);

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#0052CC]">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="ml-4 text-2xl font-bold text-black">Datos Personales</h1>
      </header>

      <div className="mb-6" aria-label="Progreso: paso 1 de 2" role="progressbar" aria-valuenow="50">
        <div className="flex justify-between mb-2 text-xs font-bold text-gray-500 uppercase">
          <span>Información</span>
          <span>50%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div className="w-1/2 h-full bg-[#0052CC] rounded-full transition-all duration-500" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="flex-1 space-y-4 overflow-y-auto pb-6" noValidate>
        {/* Nombre */}
        <div className="space-y-1">
          <label htmlFor="nombre" className="text-xs font-bold text-gray-700 flex items-center gap-1 uppercase">
            <User size={14} /> Nombre Completo
          </label>
          <input
            {...register("nombre")}
            id="nombre"
            placeholder="Juan Pérez"
            className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl outline-none transition-all text-black
              ${errors.nombre ? 'border-red-500 focus:border-red-600' : 'border-gray-100 focus:border-[#0052CC]'}`}
          />
          {errors.nombre && <p className="text-red-600 text-[10px] font-bold flex items-center gap-1" role="alert"><AlertCircle size={12}/> {errors.nombre.message}</p>}
        </div>

        {/* Teléfono */}
        <div className="space-y-1">
          <label htmlFor="phone" className="text-xs font-bold text-gray-700 flex items-center gap-1 uppercase">
            <Smartphone size={14} /> Teléfono (Usuario)
          </label>
          <input
            {...register("phone")}
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="5512345678"
            className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl outline-none transition-all text-black
              ${errors.phone ? 'border-red-500 focus:border-red-600' : 'border-gray-100 focus:border-[#0052CC]'}`}
          />
          {errors.phone && <p className="text-red-600 text-[10px] font-bold flex items-center gap-1" role="alert"><AlertCircle size={12}/> {errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-bold text-gray-700 flex items-center gap-1 uppercase">
            <Lock size={14} /> Contraseña
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl outline-none transition-all text-black
              ${errors.password ? 'border-red-500 focus:border-red-600' : 'border-gray-100 focus:border-[#0052CC]'}`}
          />
          {errors.password && <p className="text-red-600 text-[10px] font-bold flex items-center gap-1" role="alert"><AlertCircle size={12}/> {errors.password.message}</p>}
        </div>

        {/* Placas */}
        <div className="space-y-1">
          <label htmlFor="plates" className="text-xs font-bold text-gray-700 flex items-center gap-1 uppercase">
            <Car size={14} /> Placas del Vehículo
          </label>
          <input
            {...register("plates")}
            id="plates"
            placeholder="95YJT3"
            style={{ textTransform: 'uppercase' }}
            className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl outline-none transition-all text-black font-mono font-bold
              ${errors.plates ? 'border-red-500 focus:border-red-600' : 'border-gray-100 focus:border-[#0052CC]'}`}
          />
          {errors.plates && <p className="text-red-600 text-[10px] font-bold flex items-center gap-1" role="alert"><AlertCircle size={12}/> {errors.plates.message}</p>}
        </div>

        <button type="submit" className="w-full h-14 bg-[#0052CC] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0065FF] shadow-lg transition-all active:scale-95">
          Continuar <ChevronRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default RegisterStep1;
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, ShieldCheck, Users, LogOut, AlertCircle, Loader2 } from 'lucide-react';

// Validación para registrar guardias (Control de Calidad)
const guardSchema = z.object({
  nombre: z.string().min(3, "Nombre muy corto"),
  phone: z.string().min(10, "10 dígitos requeridos").max(10, "Máximo 10 dígitos"),
  // Contraseña por defecto que el Admin asigna
  password: z.string().min(6, "Mínimo 6 caracteres")
});

const AdminDashboard = ({ onLogout }) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(guardSchema)
  });

  useEffect(() => {
    setFocus("nombre");
  }, [setFocus]);

  const onSubmit = async (data) => {
    console.log("Registrando Guardia en la Zona:", data);
    // Simulación de Fetch a la DB
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Guardia registrado con éxito");
    reset(); // Limpia el formulario para el siguiente guardia
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Admin */}
      <header className="bg-[#0052CC] text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={28} />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
        <div className="bg-white/10 p-4 rounded-xl">
          <p className="text-blue-100 text-xs uppercase font-bold">Zona Residencial</p>
          <p className="text-lg font-bold">Bosques de Tehuacán</p>
        </div>
      </header>

      <main className="flex-1 p-6 -mt-4">
        {/* Estadísticas Rápidas (Resiliencia) */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <Users className="text-blue-600 mb-1" size={24} />
            <span className="text-2xl font-black text-black">12</span>
            <span className="text-gray-500 text-[10px] font-bold">GUARDIAS</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <ShieldCheck className="text-green-600 mb-1" size={24} />
            <span className="text-2xl font-black text-black">Activa</span>
            <span className="text-gray-500 text-[10px] font-bold">SEGURIDAD</span>
          </div>
        </div>

        {/* Formulario de Registro de Guardia */}
        <section className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
            <UserPlus size={20} className="text-blue-600" /> Nuevo Guardia
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Nombre del Guardia</label>
              <input 
                {...register("nombre")}
                className={`w-full h-12 px-4 rounded-xl border-2 transition-all outline-none text-black font-medium
                  ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-blue-600'}`}
                placeholder="Ej. Roberto Gómez"
              />
              {errors.nombre && <p className="text-red-600 text-[10px] mt-1 font-bold">{errors.nombre.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Teléfono (Usuario)</label>
              <input 
                {...register("phone")}
                type="tel"
                className={`w-full h-12 px-4 rounded-xl border-2 transition-all outline-none text-black font-medium
                  ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-blue-600'}`}
                placeholder="10 dígitos"
              />
              {errors.phone && <p className="text-red-600 text-[10px] mt-1 font-bold">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Contraseña Temporal</label>
              <input 
                {...register("password")}
                type="password"
                className={`w-full h-12 px-4 rounded-xl border-2 transition-all outline-none text-black font-medium
                  ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-blue-600'}`}
                placeholder="Mín. 6 caracteres"
              />
              {errors.password && <p className="text-red-600 text-[10px] mt-1 font-bold">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-14 bg-black text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "REGISTRAR GUARDIA"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
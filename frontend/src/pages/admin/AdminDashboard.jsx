import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, ShieldCheck, Users, LogOut, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

// 1. Esquema de validación con Zod (Garantiza calidad de datos en la DB)
const guardSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  phone: z.string()
    .min(10, "El teléfono debe tener 10 dígitos")
    .max(10, "El teléfono debe tener 10 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const AdminDashboard = ({ onLogout }) => {
  const [serverMessage, setServerMessage] = useState({ type: '', msg: '' });
  
  // Recuperamos los datos del Admin logueado desde el LocalStorage
  const adminData = JSON.parse(localStorage.getItem('user')) || { nombre: 'Admin', zone_id: null };

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(guardSchema)
  });

  // Gestión de Foco: Event-driven UI para agilizar el registro
  useEffect(() => {
    setFocus("nombre");
  }, [setFocus]);

  // Lógica Asíncrona para registrar el Guardia en la BD
  const onSubmit = async (data) => {
    setServerMessage({ type: '', msg: '' });

    // Preparamos el payload con el zone_id del Admin (Multitenant)
    const payload = {
      ...data,
      role: 'guard',
      zone_id: adminData.zone_id // El guardia pertenece a la misma zona que el Admin
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || "Error al registrar el guardia");
      }

      setServerMessage({ type: 'success', msg: "Guardia registrado exitosamente" });
      reset(); // Limpia el formulario tras el éxito
    } catch (error) {
      setServerMessage({ type: 'error', msg: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header con información de la Zona */}
      <header className="bg-[#0052CC] text-white p-6 rounded-b-[2.5rem] shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">Panel de Control</h1>
              <p className="text-blue-100 text-xs mt-1">Admin: {adminData.nombre}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-3 bg-white/10 hover:bg-red-500/20 rounded-xl transition-all active:scale-90"
            aria-label="Cerrar Sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
        
        <div className="bg-white/10 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
          <p className="text-blue-200 text-[10px] uppercase font-black tracking-widest mb-1">Zona Residencial Activa</p>
          <div className="flex justify-between items-end">
            <p className="text-lg font-bold">Fraccionamiento Bosques</p>
            <span className="text-[10px] bg-green-400 text-green-900 px-2 py-0.5 rounded-full font-bold">ID: {adminData.zone_id || '0'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 -mt-6">
        {/* Estadísticas de la Zona */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <Users className="text-blue-600 mb-2" size={28} />
            <span className="text-3xl font-black text-gray-800">1</span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Guardias Activos</span>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <ShieldCheck className="text-green-500 mb-2" size={28} />
            <span className="text-sm font-black text-gray-800 leading-tight">Acceso<br/>Protegido</span>
          </div>
        </div>

        {/* Registro de Nuevo Personal */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <UserPlus size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Alta de Guardia</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Mensajes del Servidor */}
            {serverMessage.msg && (
              <div 
                className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
                  serverMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}
                role="alert"
              >
                {serverMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-bold">{serverMessage.msg}</p>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Nombre Completo</label>
              <input 
                {...register("nombre")}
                placeholder="Nombre del guardia"
                className={`w-full h-14 px-5 rounded-2xl border-2 transition-all outline-none text-black font-semibold
                  ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-blue-600 bg-gray-50'}`}
              />
              {errors.nombre && <p className="text-red-600 text-[10px] mt-1 font-bold ml-1">{errors.nombre.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Teléfono / Usuario</label>
                <input 
                  {...register("phone")}
                  type="tel"
                  inputMode="numeric"
                  placeholder="10 dígitos"
                  className={`w-full h-14 px-5 rounded-2xl border-2 transition-all outline-none text-black font-semibold
                    ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-blue-600 bg-gray-50'}`}
                />
                {errors.phone && <p className="text-red-600 text-[10px] mt-1 font-bold ml-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Contraseña de Acceso</label>
                <input 
                  {...register("password")}
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full h-14 px-5 rounded-2xl border-2 transition-all outline-none text-black font-semibold
                    ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-blue-600 bg-gray-50'}`}
                />
                {errors.password && <p className="text-red-600 text-[10px] mt-1 font-bold ml-1">{errors.password.message}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-16 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" /> <span aria-live="assertive">Registrando...</span></>
              ) : (
                "CONFIRMAR REGISTRO"
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
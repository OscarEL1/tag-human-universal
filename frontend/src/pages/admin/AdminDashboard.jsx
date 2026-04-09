import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, ShieldCheck, Users, LogOut, AlertCircle, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockUsers, USERS_PAGE_SIZE } from '../../data/mockUsers';
import { ingresosPorHora } from '../../data/mockIngresos';
import IngresosChart from '../../components/admin/IngresosChart';
import { API_URL } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

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
  const { user: adminData } = useAuth();
  const [serverMessage, setServerMessage] = useState({ type: '', msg: '' });
  // Paginación simulada tabla usuarios (10 filas fijas; controles anterior/siguiente)
  const [usersPage, setUsersPage] = useState(0);
  const totalUsersPages = Math.max(1, Math.ceil(mockUsers.length / USERS_PAGE_SIZE));
  const paginatedUsers = mockUsers.slice(
    usersPage * USERS_PAGE_SIZE,
    (usersPage + 1) * USERS_PAGE_SIZE
  );
  
  const adminProfile = adminData || { nombre: 'Admin', zone_id: null };

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
      zone_id: adminProfile.zone_id // El guardia pertenece a la misma zona que el Admin
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
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
              <p className="text-blue-100 text-xs mt-1">Admin: {adminProfile.nombre}</p>
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
            <span className="text-[10px] bg-green-400 text-green-900 px-2 py-0.5 rounded-full font-bold">ID: {adminProfile.zone_id || '0'}</span>
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
              <label htmlFor="guard-name" className="block text-xs font-bold text-gray-600 mb-2 ml-1">Nombre Completo</label>
              <input
                {...register("nombre")}
                id="guard-name"
                placeholder="Nombre del guardia"
                className={`w-full h-14 px-5 rounded-2xl border-2 transition-all outline-none text-black font-semibold
                  ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-blue-600 bg-gray-50'}`}
              />
              {errors.nombre && <p className="text-red-600 text-[10px] mt-1 font-bold ml-1">{errors.nombre.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label htmlFor="guard-phone" className="block text-xs font-bold text-gray-600 mb-2 ml-1">Teléfono / Usuario</label>
                <input
                  {...register("phone")}
                  id="guard-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10 dígitos"
                  className={`w-full h-14 px-5 rounded-2xl border-2 transition-all outline-none text-black font-semibold
                    ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-blue-600 bg-gray-50'}`}
                />
                {errors.phone && <p className="text-red-600 text-[10px] mt-1 font-bold ml-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="guard-password" className="block text-xs font-bold text-gray-600 mb-2 ml-1">Contraseña de Acceso</label>
                <input
                  {...register("password")}
                  id="guard-password"
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

        {/* Tabla de usuarios registrados (accesible: table, thead, th scope="col", paginación por teclado) */}
        <section
          className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 mt-8"
          role="region"
          aria-labelledby="titulo-usuarios"
        >
          <h2 id="titulo-usuarios" className="text-xl font-bold text-gray-800 mb-4">
            Usuarios registrados
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr>
                  <th scope="col" className="p-3 bg-gray-50 border-b-2 border-gray-200 text-gray-600 text-xs font-bold uppercase">ID</th>
                  <th scope="col" className="p-3 bg-gray-50 border-b-2 border-gray-200 text-gray-600 text-xs font-bold uppercase">Nombre</th>
                  <th scope="col" className="p-3 bg-gray-50 border-b-2 border-gray-200 text-gray-600 text-xs font-bold uppercase">Email</th>
                  <th scope="col" className="p-3 bg-gray-50 border-b-2 border-gray-200 text-gray-600 text-xs font-bold uppercase">Fecha de registro</th>
                  <th scope="col" className="p-3 bg-gray-50 border-b-2 border-gray-200 text-gray-600 text-xs font-bold uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-800 font-medium">{user.id}</td>
                    <td className="p-3 text-gray-800">{user.nombre}</td>
                    <td className="p-3 text-gray-600">{user.email}</td>
                    <td className="p-3 text-gray-600">{user.fechaRegistro}</td>
                    <td className="p-3">
                      <span className={user.estado === 'Activo' ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                        {user.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Controles de paginación: accesibles por teclado (Tab, Enter/Espacio), foco visible */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500" aria-live="polite">
              Página {usersPage + 1} de {totalUsersPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUsersPage((p) => Math.max(0, p - 1))}
                disabled={usersPage === 0}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC] focus-visible:ring-offset-2"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden /> Anterior
              </button>
              <button
                type="button"
                onClick={() => setUsersPage((p) => Math.min(totalUsersPages - 1, p + 1))}
                disabled={usersPage >= totalUsersPages - 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC] focus-visible:ring-offset-2"
                aria-label="Página siguiente"
              >
                Siguiente <ChevronRight className="w-5 h-5" aria-hidden />
              </button>
            </div>
          </div>
        </section>

        {/* Gráfica simple de ingresos (mock) + alternativa textual (sr-only) */}
        <IngresosChart data={ingresosPorHora} title="Ingresos por hora (simulado)" />
      </main>
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';

const loginSchema = z.object({
  phone: z.string()
    .min(10, "El teléfono debe tener 10 dígitos")
    .max(10, "El teléfono debe tener 10 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const LoginScreen = ({ onNavigateToRegister }) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setFocus("phone");
  }, [setFocus]);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const result = await loginUser(data);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'guard') {
        navigate('/guard/scanner');
      } else {
        navigate('/app/qr');
      }
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1A1A1A]">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        {/* CABECERA RESTAURADA */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#0052CC] rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Tag Human</h1>
          <p className="text-gray-500 text-sm">Secure Access System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center gap-3" role="alert">
              <AlertCircle className="text-red-500 shrink-0" />
              <p className="text-red-700 text-sm font-medium">{serverError}</p>
            </div>
          )}

          {/* INPUTS RESTAURADOS */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Teléfono</label>
            <input 
              {...register("phone")}
              id="phone"
              type="tel"
              placeholder="10 dígitos"
              className={`w-full h-12 px-4 rounded-lg border-2 outline-none text-black ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-[#0052CC]'}`}
            />
            {errors.phone && <p className="text-red-600 text-xs font-medium">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Contraseña</label>
            <input 
              {...register("password")}
              id="password"
              type="password"
              className={`w-full h-12 px-4 rounded-lg border-2 outline-none text-black ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-[#0052CC]'}`}
            />
            {errors.password && <p className="text-red-600 text-xs font-medium">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#0052CC] hover:bg-[#0065FF] disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isSubmitting ? <><Loader2 className="animate-spin size-5" /><span>Cargando...</span></> : "Iniciar Sesión"}
          </button>

          <div className="text-center mt-4 border-t pt-4">
            <span className="text-gray-500 text-sm">¿No tienes cuenta? </span>
            <button type="button" onClick={onNavigateToRegister} className="text-[#0052CC] text-sm font-bold hover:underline">Registro</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
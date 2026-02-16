import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 1. Esquema de validación con Zod (Resiliencia y Tipado)
const loginSchema = z.object({
  phone: z.string()
    .min(10, "El teléfono debe tener 10 dígitos")
    .max(10, "El teléfono debe tener 10 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const LoginScreen = ({ onNavigateToRegister }) => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // 2. Gestión de Foco: Cumple con "Event-driven UI" al cargar
  useEffect(() => {
    setFocus("phone");
  }, [setFocus]);

  // 3. Simulación de Autenticación por Roles (Lógica de Negocio)
  const onSubmit = async (data) => {
    console.log("Datos enviados:", data);
    
    // Simulación de delay de red para probar estados de carga (Resiliencia)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Lógica de redirección basada en roles (BD Mockup)
    // En producción, esto vendrá del token JWT
    if (data.phone === "5512345678") {
      navigate('/guard/scanner'); // Rol: Guardia
    } else {
      navigate('/app/qr'); // Rol: Driver
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1A1A1A]">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#0052CC] rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Tag Human</h1>
          <p className="text-gray-500 text-sm">Secure Access System</p>
        </div>

        {/* handleSubmit maneja el evento de teclado 'Enter' automáticamente */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          
          {/* Campo Teléfono */}
          <div className="space-y-2">
            <label 
              htmlFor="phone" 
              className={`block text-sm font-semibold mb-2 ${errors.phone ? 'text-red-600' : 'text-gray-700'}`}
            >
              Teléfono
            </label>
            <input 
              {...register("phone")}
              id="phone"
              type="tel" 
              inputMode="numeric" // Optimización móvil: Abre teclado numérico
              placeholder="10 dígitos" 
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`w-full h-12 px-4 rounded-lg border-2 transition-all outline-none text-black
                ${errors.phone 
                  ? 'border-red-500 bg-red-50 focus:border-red-600' 
                  : 'border-gray-100 bg-gray-50 focus:border-[#0052CC]'}`}
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-600 text-xs font-medium flex items-center gap-1" role="alert">
                <AlertCircle className="size-3" /> {errors.phone.message}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className={`block text-sm font-semibold mb-2 ${errors.password ? 'text-red-600' : 'text-gray-700'}`}
            >
              Contraseña
            </label>
            <input 
              {...register("password")}
              id="password"
              type="password" 
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`w-full h-12 px-4 rounded-lg border-2 transition-all outline-none text-black
                ${errors.password 
                  ? 'border-red-500 bg-red-50 focus:border-red-600' 
                  : 'border-gray-100 bg-gray-50 focus:border-[#0052CC]'}`}
            />
            {errors.password && (
              <p id="password-error" className="text-red-600 text-xs font-medium flex items-center gap-1" role="alert">
                <AlertCircle className="size-3" /> {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón con estados de carga y feedback visual */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#0052CC] hover:bg-[#0065FF] disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin size-5" />
                <span>Verificando...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          <div className="text-center mt-4 border-t pt-4">
            <span className="text-gray-500 text-sm">¿No tienes cuenta? </span>
            <button 
              type="button"
              onClick={onNavigateToRegister}
              className="text-[#0052CC] text-sm font-bold hover:underline focus:ring-2 focus:ring-[#0052CC] rounded px-1 outline-none"
            >
              Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
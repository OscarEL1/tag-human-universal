import React, { useEffect, useState } from 'react'; // Agregamos useState
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth'; // Importamos el servicio

const loginSchema = z.object({
  phone: z.string()
    .min(10, "El teléfono debe tener 10 dígitos")
    .max(10, "El teléfono debe tener 10 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const LoginScreen = ({ onNavigateToRegister }) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null); // Estado para errores de red
  
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

  // LOGICA ASÍNCRONA REAL
  const onSubmit = async (data) => {
    setServerError(null); // Limpiamos errores previos
    
    try {
      const result = await loginUser(data);
      
      // Guardar sesión (Cumpliendo persistencia)
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // REDIRECCIÓN BASADA EN ROLES (Ahora viene de la BD real)
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'guard') {
        navigate('/guard/scanner');
      } else {
        navigate('/app/qr');
      }
      
    } catch (error) {
      // Manejo de errores de red accesible
      setServerError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1A1A1A]">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        {/* ... (Cabecera igual) ... */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          
          {/* MENSAJE DE ERROR DEL SERVIDOR ACCESIBLE */}
          {serverError && (
            <div 
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center gap-3 animate-in fade-in"
              role="alert" // Avisa a lectores de pantalla inmediatamente
            >
              <AlertCircle className="text-red-500 shrink-0" />
              <p className="text-red-700 text-sm font-medium">{serverError}</p>
            </div>
          )}

          {/* ... (Inputs de Phone y Password igual) ... */}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#0052CC] hover:bg-[#0065FF] disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin size-5" />
                <span aria-live="assertive">Verificando credenciales...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
          
          {/* ... (Link de registro igual) ... */}
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
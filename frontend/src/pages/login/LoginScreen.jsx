import React from 'react';
import { Shield } from 'lucide-react';

const LoginScreen = ({ onNavigateToRegister }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#0052CC] rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Tag Human</h1>
          <p className="text-gray-500 text-sm">Secure Access System</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
            <input 
              type="tel" 
              placeholder="+52..." 
              className="w-full h-12 px-4 rounded-lg border-2 border-gray-100 bg-gray-50 text-black focus:border-[#0052CC] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              className="w-full h-12 px-4 rounded-lg border-2 border-gray-100 bg-gray-50 text-black focus:border-[#0052CC] outline-none transition-all"
            />
          </div>

          <button className="w-full h-12 bg-[#0052CC] hover:bg-[#0065FF] text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95">
            Iniciar Sesión
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">¿No tienes cuenta? </span>
            <button 
              type="button"
              onClick={onNavigateToRegister}
              className="text-[#0052CC] text-sm font-bold hover:underline"
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
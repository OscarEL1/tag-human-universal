import React, { useState, useEffect, useRef } from 'react';
import { LogOut, RefreshCw, ShieldCheck } from 'lucide-react';

const DriverDashboard = ({ licensePlate, driverName, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const logoutBtnRef = useRef(null);

  // Gestión de Foco: El botón de salir recibe el foco inicial para navegación rápida
  useEffect(() => {
    logoutBtnRef.current?.focus();
  }, []);

  // Simulación de QR Dinámico (TOTP)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white px-6 py-8 flex flex-col">
      {/* Header con nombre del conductor */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-xl font-bold">Mi Pase de Acceso</h1>
          <p className="text-gray-400 text-sm">Hola, {driverName}</p>
        </div>
        <button
          ref={logoutBtnRef}
          onClick={onLogout}
          className="p-3 bg-gray-800 rounded-full hover:bg-red-900/40 transition-colors focus:ring-2 focus:ring-red-500 outline-none"
          aria-label="Cerrar sesión segura"
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>
      </header>

      {/* Contenedor del QR Dinámico */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="relative p-4 bg-white rounded-3xl shadow-[0_0_50px_rgba(0,82,204,0.3)]">
          {/* Aquí iría el componente QRCodeSVG en el futuro */}
          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden border-8 border-white">
             <div className="grid grid-cols-4 gap-2 opacity-20">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-black"></div>
                ))}
             </div>
          </div>
          
          {/* Contador de tiempo (ARIA-LIVE para anunciar refresco) */}
          <div 
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#0052CC] px-4 py-2 rounded-full flex items-center gap-2 border-4 border-[#1A1A1A]"
            role="timer"
            aria-live="polite"
          >
            <RefreshCw className={`w-4 h-4 ${timeLeft < 5 ? 'animate-spin' : ''}`} />
            <span className="font-mono font-bold text-sm">Expira en {timeLeft}s</span>
          </div>
        </div>

        {/* Datos del vehículo expuestos claramente */}
        <section className="mt-16 w-full max-w-xs text-center" aria-labelledby="vehiculo-info">
          <h2 id="vehiculo-info" className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-bold">Vehículo Registrado</h2>
          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-2xl">
            <span className="text-3xl font-black tracking-tighter text-[#0052CC]" style={{ fontFamily: 'monospace' }}>
              {licensePlate}
            </span>
          </div>
        </section>
      </main>

      {/* Indicador de Seguridad */}
      <footer className="mt-auto flex justify-center items-center gap-2 text-gray-500 text-xs py-4">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        <span>Identidad Verificada por Tag Human</span>
      </footer>
    </div>
  );
};

export default DriverDashboard;
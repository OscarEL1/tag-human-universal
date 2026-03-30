import React, { useState, useEffect, useRef } from 'react';
import { LogOut, RefreshCw, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; // Asegúrate de instalarlo: npm install qrcode.react
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = ({ onLogout }) => {
  const { user: authUser } = useAuth();
  const [timeLeft, setTimeLeft] = useState(30);
  const logoutBtnRef = useRef(null);

  const user = authUser
    ? { ...authUser, plates: authUser.plates || 'S/N' }
    : { nombre: 'Conductor', plates: 'S/N', id: null };

  useEffect(() => {
    logoutBtnRef.current?.focus();
  }, []);

  // Agregamos un estado para el timestamp y evitar la función impura en el renderizado
  const [timestamp, setTimestamp] = useState(() => Date.now());

  // 2. LÓGICA DE QR DINÁMICO (Seguridad)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 30 : prev - 1));
      setTimestamp(Date.now()); // Se actualiza el timestamp de forma pura en el ciclo
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. GENERACIÓN DE CONTENIDO PARA EL QR
  // Usamos el timestamp del estado de React, no la llamada directa a la función
  const qrValue = JSON.stringify({
    id: user.id,
    plates: user.plates,
    timestamp: timestamp
  });

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white px-6 py-8 flex flex-col">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Mi Pase de Acceso</h1>
          <p className="text-gray-400 text-sm">Bienvenido, <span className="text-white font-semibold">{user.nombre}</span></p>
        </div>
        <button
          ref={logoutBtnRef}
          onClick={onLogout}
          className="p-3 bg-gray-800 rounded-full hover:bg-red-900/40 transition-all active:scale-90 focus:ring-2 focus:ring-red-500 outline-none"
          aria-label="Cerrar sesión segura"
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        {/* CONTENEDOR DE QR REAL */}
        <div className="relative p-6 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(0,82,204,0.4)] transition-transform hover:scale-105">
          <div className="p-4 bg-white rounded-2xl border-2 border-gray-100">
            {/* Usamos QRCodeSVG para generar el QR con los datos del usuario */}
            <QRCodeSVG
              value={qrValue}
              size={220}
              level="H" // Alta corrección de errores para escaneos rápidos
              includeMargin={false}
            />
          </div>

          <div
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#0052CC] px-5 py-2.5 rounded-full flex items-center gap-3 border-4 border-[#1A1A1A] shadow-lg"
            role="timer"
            aria-live="polite"
          >
            <RefreshCw className={`w-4 h-4 ${timeLeft < 5 ? 'animate-spin text-orange-300' : 'text-white'}`} />
            <span className="font-mono font-black text-xs tracking-wider">EXPIRA EN {timeLeft}S</span>
          </div>
        </div>

        {/* DATOS DEL VEHÍCULO (Provenientes de la DB) */}
        <section className="mt-16 w-full max-w-xs text-center">
          <h2 className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3">Vehículo Registrado</h2>
          <div className="bg-[#252525] border-2 border-gray-800 p-5 rounded-3xl shadow-inner group">
            <span className="text-4xl font-black tracking-tighter text-[#0052CC] group-hover:text-[#0065FF] transition-colors" style={{ fontFamily: 'monospace' }}>
              {user.plates}
            </span>
          </div>
          <p className="mt-4 text-gray-500 text-[10px] italic">Presenta este código al guardia de la zona residencial</p>
        </section>
      </main>

      <footer className="mt-auto flex justify-center items-center gap-2 text-gray-600 text-[10px] py-4 uppercase font-bold tracking-widest">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>Seguridad Cifrada • Tag Human 2026</span>
      </footer>
    </div>
  );
};

export default DriverDashboard;
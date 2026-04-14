import React, { useState } from 'react';
import { Camera, LogIn, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageTransition from '../../components/shared/PageTransition';

const GuardScanner = ({ onScanResult }) => {
  const { user: guardData } = useAuth();
  const [mode, setMode] = useState('entry');
  const [isScanning, setIsScanning] = useState(false);
  const [scanFlash, setScanFlash] = useState(null); // null | 'success' | 'error'

  const guardProfile = guardData || { nombre: 'Guardia' };

  const simulateScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);

      // Flash visual de éxito + vibración corta
      setScanFlash('success');
      if ('vibrate' in navigator) navigator.vibrate(200);
      setTimeout(() => setScanFlash(null), 600);

      // En un caso real, aquí usaríamos una librería como 'html5-qrcode'
      // para decodificar el valor del QR del conductor.
      onScanResult({
        plate: '93TLY5',
        name: 'Conductor Registrado',
        mode: mode,
        guardId: guardData?.id ?? null,
      });
    }, 2000);
  };

  return (
    <PageTransition>
    <main className="min-h-screen bg-gray-50 px-6 py-8 flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black leading-none">Escáner</h1>
          <p className="text-gray-500 text-xs mt-1">Puesto: {guardProfile.nombre}</p>
        </div>
        <div className="bg-green-100 p-2 rounded-lg">
          <ShieldCheck className="text-green-600 w-5 h-5" />
        </div>
      </header>

      {/* Selector de Modo (Accesibilidad 9 puntos) */}
      <div className="grid grid-cols-2 gap-4 mb-8" role="radiogroup" aria-label="Modo de escaneo">
        <button
          onClick={() => setMode('entry')}
          role="radio"
          aria-checked={mode === 'entry'}
          className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 font-bold transition-all outline-none ${mode === 'entry' ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200' : 'bg-white border-gray-100 text-gray-400'
            }`}
        >
          <LogIn className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest">Entrada</span>
        </button>
        <button
          onClick={() => setMode('exit')}
          role="radio"
          aria-checked={mode === 'exit'}
          className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 font-bold transition-all outline-none ${mode === 'exit' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-gray-100 text-gray-400'
            }`}
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest">Salida</span>
        </button>
      </div>

      {/* Visor del Escáner */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1A1A1A] rounded-[2.5rem] relative overflow-hidden shadow-2xl border-8 border-white">
        {isScanning ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            </div>
            <p className="text-white font-black text-xs tracking-widest uppercase animate-pulse">Leyendo QR...</p>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 border-[2px] border-white/10 m-12 rounded-3xl border-dashed"></div>
            <Camera className="w-20 h-20 text-white opacity-10" />
          </>
        )}

        {/* Línea de escaneo láser (Efecto visual) */}
        {isScanning && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-line"></div>
        )}

        {/* Flash de resultado: verde=éxito, rojo=error */}
        {scanFlash && (
          <div
            aria-hidden="true"
            className={`absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-300 ${
              scanFlash === 'success' ? 'bg-green-500 opacity-40' : 'bg-red-500 opacity-40'
            }`}
          />
        )}
      </div>

      <button
        onClick={simulateScan}
        disabled={isScanning}
        className="mt-8 w-full h-16 bg-black text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all disabled:bg-gray-300"
      >
        {isScanning ? "PROCESANDO..." : "ESCANEAR CÓDIGO"}
      </button>

      <style jsx>{`
        @keyframes scan-line {
          0% { top: 20%; }
          100% { top: 80%; }
        }
        .animate-scan-line {
          animation: scan-line 1.5s infinite alternate ease-in-out;
        }
      `}</style>
    </main>
    </PageTransition>
  );
};

export default GuardScanner;
import React, { useState } from 'react';
import { Camera, LogIn, LogOut, Loader2 } from 'lucide-react';

const GuardScanner = ({ onScanResult }) => {
  const [mode, setMode] = useState('entry');
  const [isScanning, setIsScanning] = useState(false);

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Enviamos el modo (entry/exit) junto con los datos del conductor
      onScanResult({ 
        plate: 'ABC-1234', 
        name: 'Repartidor Demo',
        mode: mode // <--- Dato clave para la siguiente pantalla
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-black">Escáner de Seguridad</h1>

      {/* Control por Teclado: Switch de modo accesible */}
      <div className="grid grid-cols-2 gap-4 mb-8" role="radiogroup" aria-label="Modo de escaneo">
        <button
          onClick={() => setMode('entry')}
          aria-checked={mode === 'entry'}
          className={`h-16 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all outline-none focus:ring-4 focus:ring-green-200 ${
            mode === 'entry' ? 'bg-green-50 border-[#00875A] text-[#00875A]' : 'border-gray-100 text-gray-400'
          }`}
        >
          <LogIn className="w-5 h-5" /> ENTRADA
        </button>
        <button
          onClick={() => setMode('exit')}
          aria-checked={mode === 'exit'}
          className={`h-16 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all outline-none focus:ring-4 focus:ring-blue-200 ${
            mode === 'exit' ? 'bg-blue-50 border-[#0052CC] text-[#0052CC]' : 'border-gray-100 text-gray-400'
          }`}
        >
          <LogOut className="w-5 h-5" /> SALIDA
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-black rounded-3xl relative overflow-hidden shadow-2xl border-4 border-gray-100">
        {isScanning ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <p className="text-white font-bold" aria-live="assertive">Procesando código QR...</p>
          </div>
        ) : (
          <Camera className="w-16 h-16 text-white opacity-20" />
        )}
      </div>

      <button
        onClick={simulateScan}
        disabled={isScanning}
        className="mt-8 w-full h-14 bg-[#1A1A1A] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-black focus:ring-4 focus:ring-gray-300 outline-none"
      >
        {isScanning ? "Espere..." : "Simular Lectura QR"}
      </button>
    </div>
  );
};

export default GuardScanner;
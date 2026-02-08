import React, { useState } from 'react';
import { Camera, LogIn, LogOut, Loader2 } from 'lucide-react';

const GuardScanner = ({ onScanResult }) => {
  const [mode, setMode] = useState('entry');
  const [isScanning, setIsScanning] = useState(false);

  const simulateScan = () => {
    setIsScanning(true);
    // Simulación de lectura dinámica del DOM sin recargar
    setTimeout(() => {
      setIsScanning(false);
      onScanResult({ plate: 'ABC-1234', name: 'Repartidor Demo' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Escáner de Seguridad</h1>

      {/* Switch de Modo accesible */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setMode('entry')}
          className={`h-16 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
            mode === 'entry' ? 'bg-green-50 border-[#00875A] text-[#00875A]' : 'border-gray-200 text-gray-400'
          }`}
        >
          <LogIn className="w-5 h-5" /> ENTRADA
        </button>
        <button
          onClick={() => setMode('exit')}
          className={`h-16 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
            mode === 'exit' ? 'bg-blue-50 border-[#0052CC] text-[#0052CC]' : 'border-gray-200 text-gray-400'
          }`}
        >
          <LogOut className="w-5 h-5" /> SALIDA
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-black rounded-3xl relative overflow-hidden shadow-2xl">
        {isScanning ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <p className="text-white font-medium" aria-live="assertive">Escaneando código...</p>
          </div>
        ) : (
          <Camera className="w-16 h-16 text-white opacity-30" />
        )}
      </div>

      <button
        onClick={simulateScan}
        disabled={isScanning}
        className="mt-8 w-full h-14 bg-[#1A1A1A] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        {isScanning ? "Procesando..." : "Simular Escaneo de QR"}
      </button>
    </div>
  );
};

export default GuardScanner;
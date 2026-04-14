import React, { useState } from 'react';
import { Camera, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageTransition from '../../components/shared/PageTransition';
import QrScanner from '../../components/shared/QrScanner';

const GuardScanner = ({ onScanResult }) => {
  const { user: guardData } = useAuth();
  const [mode, setMode] = useState('entry');
  const [isScanning, setIsScanning] = useState(false);
  const [scanFlash, setScanFlash] = useState(null); // null | 'success' | 'error'
  const [scanError, setScanError] = useState(null);

  const guardProfile = guardData || { nombre: 'Guardia' };

  const handleScanSuccess = (decodedText) => {
    setScanError(null);
    let parsed;

    try {
      parsed = JSON.parse(decodedText);
    } catch {
      triggerFlash('error');
      setScanError('Código QR no válido');
      setIsScanning(false);
      return;
    }

    if (
      typeof parsed.id === 'undefined' ||
      typeof parsed.plates === 'undefined'
    ) {
      triggerFlash('error');
      setScanError('Código QR no válido');
      setIsScanning(false);
      return;
    }

    triggerFlash('success');
    if ('vibrate' in navigator) navigator.vibrate(200);
    setIsScanning(false);

    onScanResult({
      plate: parsed.plates,
      driverId: parsed.id,
      name: 'Conductor Registrado',
      mode,
      guardId: guardData?.id ?? null,
    });
  };

  const handleScanError = (msg) => {
    setScanError(msg);
  };

  const triggerFlash = (type) => {
    setScanFlash(type);
    setTimeout(() => setScanFlash(null), 600);
  };

  const handleToggleScanning = () => {
    setScanError(null);
    setIsScanning((prev) => !prev);
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

      {/* Selector de Modo */}
      <div className="grid grid-cols-2 gap-4 mb-8" role="radiogroup" aria-label="Modo de escaneo">
        <button
          onClick={() => setMode('entry')}
          role="radio"
          aria-checked={mode === 'entry'}
          className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 font-bold transition-all outline-none ${
            mode === 'entry'
              ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200'
              : 'bg-white border-gray-100 text-gray-400'
          }`}
        >
          <LogIn className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest">Entrada</span>
        </button>
        <button
          onClick={() => setMode('exit')}
          role="radio"
          aria-checked={mode === 'exit'}
          className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 font-bold transition-all outline-none ${
            mode === 'exit'
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-white border-gray-100 text-gray-400'
          }`}
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest">Salida</span>
        </button>
      </div>

      {/* Visor */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {isScanning ? (
          /* Cámara real activa */
          <div className="w-full relative">
            <QrScanner
              isScanning={isScanning}
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
            />
            {/* Flash de resultado superpuesto */}
            {scanFlash && (
              <div
                aria-hidden="true"
                className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
                  scanFlash === 'success' ? 'bg-green-500 opacity-40' : 'bg-red-500 opacity-40'
                }`}
              />
            )}
          </div>
        ) : (
          /* Placeholder cuando la cámara está apagada */
          <div className="w-full flex flex-col items-center justify-center bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white" style={{ aspectRatio: '1 / 1' }}>
            <div className="absolute inset-0 border-[2px] border-white/10 m-12 rounded-3xl border-dashed pointer-events-none" />
            <Camera className="w-20 h-20 text-white opacity-10" />
          </div>
        )}
      </div>

      {/* Mensaje de error de QR */}
      {scanError && !isScanning && (
        <p className="mt-4 text-center text-red-500 text-sm font-bold" role="alert">
          {scanError}
        </p>
      )}

      <button
        onClick={handleToggleScanning}
        className={`mt-8 w-full h-16 font-black rounded-2xl shadow-xl active:scale-95 transition-all text-white ${
          isScanning ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-900'
        }`}
      >
        {isScanning ? 'DETENER CÁMARA' : 'ESCANEAR CÓDIGO'}
      </button>
    </main>
    </PageTransition>
  );
};

export default GuardScanner;

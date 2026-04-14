import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { RefreshCw } from 'lucide-react';

const QR_READER_ID = 'qr-reader';

const CORNER_STYLE = {
  position: 'absolute',
  width: '20px',
  height: '20px',
  borderColor: '#0052CC',
  borderStyle: 'solid',
  borderWidth: '0',
};

const corners = [
  { top: 0, left: 0,  borderTopWidth: '3px', borderLeftWidth: '3px',  borderRadius: '4px 0 0 0' },
  { top: 0, right: 0, borderTopWidth: '3px', borderRightWidth: '3px', borderRadius: '0 4px 0 0' },
  { bottom: 0, left: 0,  borderBottomWidth: '3px', borderLeftWidth: '3px',  borderRadius: '0 0 0 4px' },
  { bottom: 0, right: 0, borderBottomWidth: '3px', borderRightWidth: '3px', borderRadius: '0 0 4px 0' },
];

export default function QrScanner({ onScanSuccess, onScanError, isScanning }) {
  const html5QrRef = useRef(null);
  const isRunningRef = useRef(false);
  const hasScannedRef = useRef(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [camError, setCamError] = useState(null);

  const stopCamera = async () => {
    if (html5QrRef.current && isRunningRef.current) {
      try {
        await html5QrRef.current.stop();
      } catch {
        // already stopped
      }
      isRunningRef.current = false;
    }
  };

  const startCamera = async (facing) => {
    setCamError(null);
    hasScannedRef.current = false;

    if (!html5QrRef.current) {
      html5QrRef.current = new Html5Qrcode(QR_READER_ID);
    }

    await stopCamera();

    try {
      await html5QrRef.current.start(
        { facingMode: facing },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;
          stopCamera();
          onScanSuccess(decodedText);
        },
        () => { /* frame-level scan errors are silent */ }
      );
      isRunningRef.current = true;
    } catch (err) {
      isRunningRef.current = false;
      const msg = resolveError(err);
      setCamError(msg);
      onScanError?.(msg);
    }
  };

  useEffect(() => {
    if (isScanning) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => { stopCamera(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);

  const handleToggleCamera = async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (isScanning) await startCamera(next);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* Visor */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {/* html5-qrcode monta su video aquí */}
        <div id={QR_READER_ID} style={{ width: '100%', height: '100%' }} />

        {/* Overlay: esquinas tipo visor profesional */}
        {corners.map((style, i) => (
          <div key={i} style={{ ...CORNER_STYLE, ...style }} />
        ))}

        {/* Toggle cámara — esquina superior derecha */}
        <button
          onClick={handleToggleCamera}
          title={facingMode === 'environment' ? 'Cambiar a cámara frontal' : 'Cambiar a cámara trasera'}
          aria-label={facingMode === 'environment' ? 'Cambiar a cámara frontal' : 'Cambiar a cámara trasera'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.55)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <RefreshCw size={16} color="#fff" />
        </button>

        {/* Error de cámara superpuesto */}
        {camError && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            textAlign: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '2rem' }}>📷</span>
            <p style={{ color: '#f87171', fontWeight: 700, fontSize: '0.875rem' }}>{camError}</p>
          </div>
        )}
      </div>

      {/* Texto de estado */}
      {!camError && (
        <p style={{
          color: '#9ca3af',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textAlign: 'center',
        }}>
          Apunta al código QR
        </p>
      )}
    </div>
  );
}

function resolveError(err) {
  const msg = (err?.message || String(err)).toLowerCase();
  if (msg.includes('notallowed') || msg.includes('permission')) {
    return 'Permiso de cámara denegado. Actívalo en la configuración del navegador.';
  }
  if (msg.includes('notfound') || msg.includes('devicenotfound')) {
    return 'No se encontró ninguna cámara en este dispositivo.';
  }
  if (msg.includes('notsupported') || msg.includes('insecure')) {
    return 'La cámara requiere HTTPS. Usa una conexión segura.';
  }
  return 'No se pudo acceder a la cámara. Verifica los permisos.';
}

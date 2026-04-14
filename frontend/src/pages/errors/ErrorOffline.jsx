import { useState, useEffect } from 'react';

export default function ErrorOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      textAlign: 'center',
      fontFamily: 'sans-serif',
    }}>
      {/* Icono wifi desconectado */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ marginBottom: '1.5rem' }}
      >
        {/* Arco exterior */}
        <path
          d="M10 30 Q40 10 70 30"
          stroke="#374151"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arco medio */}
        <path
          d="M20 42 Q40 28 60 42"
          stroke="#374151"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arco interior */}
        <path
          d="M29 54 Q40 46 51 54"
          stroke="#374151"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Punto central */}
        <circle cx="40" cy="65" r="4" fill="#374151" />
        {/* Línea diagonal de "sin señal" */}
        <line
          x1="15"
          y1="15"
          x2="65"
          y2="65"
          stroke="#DE350B"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* Título */}
      <h1 style={{
        fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
        fontWeight: 900,
        color: '#ffffff',
        margin: '0 0 0.75rem',
        letterSpacing: '-0.02em',
      }}>
        Sin conexión
      </h1>

      {/* Descripción */}
      <p style={{
        fontSize: '1rem',
        color: '#9CA3AF',
        maxWidth: '360px',
        lineHeight: 1.6,
        margin: '0 0 2rem',
      }}>
        Verifica tu conexión a internet e intenta nuevamente.
      </p>

      {/* Indicador de estado */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '2rem',
        padding: '0.5rem 1rem',
        borderRadius: '2rem',
        backgroundColor: isOnline ? 'rgba(0,135,90,0.15)' : 'rgba(222,53,11,0.15)',
        border: `1px solid ${isOnline ? '#00875A' : '#DE350B'}`,
        transition: 'all 0.3s',
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isOnline ? '#00875A' : '#DE350B',
          display: 'inline-block',
        }} />
        <span style={{
          fontSize: '0.85rem',
          color: isOnline ? '#00875A' : '#DE350B',
          fontWeight: 500,
        }}>
          {isOnline ? 'Conexión restaurada' : 'Sin conexión a internet'}
        </span>
      </div>

      {/* Botón Reintentar */}
      <button
        onClick={() => window.location.reload()}
        disabled={!isOnline}
        style={{
          backgroundColor: isOnline ? '#0052CC' : '#374151',
          color: isOnline ? '#ffffff' : '#6B7280',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: isOnline ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.3s, color 0.3s',
        }}
        onMouseEnter={e => { if (isOnline) e.target.style.backgroundColor = '#0747A6'; }}
        onMouseLeave={e => { if (isOnline) e.target.style.backgroundColor = '#0052CC'; }}
      >
        {isOnline ? 'Reintentar' : 'Esperando conexión…'}
      </button>
    </div>
  );
}

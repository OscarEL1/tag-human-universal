import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/shared/PageTransition';
import { useNavigate } from 'react-router-dom';

export default function Error500({ error }) {
  const navigate = useNavigate();

  return (
    <PageTransition>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
      <h2 className="text-2xl font-semibold mb-2">Error de Servidor</h2>
      <p className="text-gray-600 mb-8" aria-live="assertive">
        Hubo un problema técnico en nuestro sistema. No te preocupes, tus datos están a salvo. Por favor, intenta recargar la página o vuelve más tarde.

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
      {/* Icono */}
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ marginBottom: '1.5rem', opacity: 0.7 }}
      >
        <path
          d="M36 8L66 60H6L36 8Z"
          stroke="#DE350B"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M36 30v14" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="36" cy="51" r="2.5" fill="#ffffff" />
      </svg>

      {/* Número grande */}
      <div style={{
        fontSize: 'clamp(6rem, 20vw, 10rem)',
        fontWeight: 900,
        lineHeight: 1,
        background: 'linear-gradient(135deg, #DE350B 0%, #FF5630 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem',
        userSelect: 'none',
      }}>
        500
      </div>

      {/* Título */}
      <h1 style={{
        fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
        fontWeight: 700,
        color: '#ffffff',
        margin: '0 0 0.75rem',
      }}>
        Error interno del servidor
      </h1>

      {/* Descripción */}
      <p style={{
        fontSize: '1rem',
        color: '#9CA3AF',
        maxWidth: '400px',
        lineHeight: 1.6,
        margin: '0 0 1rem',
      }}>
        Algo falló en nuestro sistema. Tus datos están seguros. Intenta recargar la página o vuelve más tarde.
      </p>

      {/* Detalle técnico opcional */}
      {error && (
        <details style={{ marginBottom: '1.5rem', maxWidth: '420px', width: '100%' }}>
          <summary style={{
            color: '#6B7280',
            fontSize: '0.8rem',
            cursor: 'pointer',
            userSelect: 'none',
            marginBottom: '0.5rem',
          }}>
            Ver detalle técnico
          </summary>
          <pre style={{
            backgroundColor: '#111827',
            color: '#F87171',
            fontSize: '0.75rem',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            textAlign: 'left',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            border: '1px solid #374151',
          }}>
            {error}
          </pre>
        </details>
      )}

      {/* Botones */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#0052CC',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.65rem 1.4rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => { e.target.style.backgroundColor = '#0747A6'; }}
          onMouseLeave={e => { e.target.style.backgroundColor = '#0052CC'; }}
        >
          Recargar página
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: 'transparent',
            color: '#9CA3AF',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            padding: '0.65rem 1.4rem',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.target.style.borderColor = '#6B7280'; e.target.style.color = '#ffffff'; }}
          onMouseLeave={e => { e.target.style.borderColor = '#374151'; e.target.style.color = '#9CA3AF'; }}
        >
          Ir al inicio
        </button>
      </div>
    </div>
    </PageTransition>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/shared/PageTransition';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <PageTransition>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8" aria-live="polite">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link 
        to="/" 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 outline-none transition-all"
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
        <circle cx="36" cy="36" r="34" stroke="#0052CC" strokeWidth="4" />
        <path d="M36 22v20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="36" cy="50" r="2.5" fill="#ffffff" />
      </svg>

      {/* Número grande */}
      <div style={{
        fontSize: 'clamp(6rem, 20vw, 10rem)',
        fontWeight: 900,
        lineHeight: 1,
        background: 'linear-gradient(135deg, #0052CC 0%, #4C9AFF 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem',
        userSelect: 'none',
      }}>
        404
      </div>

      {/* Título */}
      <h1 style={{
        fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
        fontWeight: 700,
        color: '#ffffff',
        margin: '0 0 0.75rem',
      }}>
        Página no encontrada
      </h1>

      {/* Descripción */}
      <p style={{
        fontSize: '1rem',
        color: '#9CA3AF',
        maxWidth: '380px',
        lineHeight: 1.6,
        margin: '0 0 2rem',
      }}>
        La página que buscas no existe o fue movida a otra dirección.
      </p>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate(-1)}
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
          ← Volver atrás
        </button>

        <button
          onClick={() => navigate('/')}
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
          Ir al inicio
        </button>
      </div>
    </div>
    </PageTransition>
  );
}

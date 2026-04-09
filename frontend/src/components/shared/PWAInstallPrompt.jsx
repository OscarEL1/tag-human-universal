import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pwa-install-dismissed';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // No mostrar si el usuario ya lo rechazó antes
    if (localStorage.getItem(STORAGE_KEY)) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'dismissed') {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    setDeferredPrompt(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Instalar aplicación"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: '#0052CC',
        color: '#ffffff',
        padding: '0.75rem 1.25rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        maxWidth: '90vw',
        width: 'max-content',
        fontFamily: 'sans-serif',
        fontSize: '0.9rem',
      }}
    >
      <span>Instala Tag Human para acceso rápido</span>
      <button
        onClick={handleInstall}
        style={{
          backgroundColor: '#ffffff',
          color: '#0052CC',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.4rem 0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.85rem',
          whiteSpace: 'nowrap',
        }}
      >
        Instalar
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Cerrar banner de instalación"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          fontSize: '1.1rem',
          lineHeight: 1,
          padding: '0 0.25rem',
          opacity: 0.8,
        }}
      >
        ✕
      </button>
    </div>
  );
}

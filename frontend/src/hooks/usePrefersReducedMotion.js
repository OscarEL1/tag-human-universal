import { useEffect, useState } from 'react';

/**
 * Hook para respetar prefers-reduced-motion.
 * Accesibilidad: si el usuario prefiere menos movimiento, desactivamos animaciones.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(Boolean(mediaQuery.matches));

    update();

    // Safari antiguo usa addListener/removeListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return reduced;
}


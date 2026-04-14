import React, { useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { User } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';

/**
 * Pantalla "Decisión de Acceso"
 * Muestra foto del repartidor (placeholder), placas del vehículo y botón Autorizar.
 * Accesible: semántica, foco visible (Button ya usa focus-visible), etiquetas ARIA donde aplica.
 */
const DecisionAcceso = () => {
  const handleAutorizar = useCallback(() => {
    // Funcional: mensaje en consola y feedback visual opcional (toast)
    console.log('[Decisión de Acceso] Autorizar pulsado');
    // Opción: podrías integrar un toast aquí si el proyecto lo tuviera
    if (typeof window !== 'undefined' && window.__toast) {
      window.__toast('Acceso autorizado');
    }
  }, []);

  return (
    <PageTransition>
    <div className="min-h-screen bg-[#1A1A1A] text-white px-6 py-8 flex flex-col">
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center" role="main" aria-labelledby="titulo-acceso">
        <h1 id="titulo-acceso" className="text-2xl font-bold text-center mb-8">
          Decisión de Acceso
        </h1>

        {/* Foto del repartidor (placeholder) */}
        <section className="flex flex-col items-center mb-8" aria-label="Datos del repartidor">
          <div
            className="w-32 h-32 rounded-2xl bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600 shrink-0"
            role="img"
            aria-label="Foto del repartidor (placeholder)"
          >
            <User className="w-16 h-16 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-gray-400 text-sm mt-3">Repartidor verificado</p>
        </section>

        {/* Placas del vehículo */}
        <section className="bg-gray-800 p-5 rounded-2xl border border-gray-600 mb-8" aria-labelledby="label-placas">
          <p id="label-placas" className="text-gray-400 text-xs uppercase font-bold mb-1">
            Placas del vehículo
          </p>
          <p className="text-2xl font-black tracking-widest font-mono" aria-label="Placas ABC-1234">
            ABC-1234
          </p>
        </section>

        {/* Botón Autorizar: accesible por teclado (Tab + Enter/Espacio), focus-visible en Button */}
        <Button
          type="button"
          onClick={handleAutorizar}
          variant="default"
          size="lg"
          className="w-full bg-[var(--action-blue)] hover:opacity-90 focus-visible:ring-3 focus-visible:ring-blue-300"
          aria-label="Autorizar acceso del repartidor"
        >
          Autorizar
        </Button>
      </main>
    </div>
    </PageTransition>
  );
};

export default DecisionAcceso;

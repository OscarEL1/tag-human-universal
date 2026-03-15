import React, { useId, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Gráfica simple de ingresos (mock).
 *
 * Accesibilidad:
 * - Respeta prefers-reduced-motion (desactiva animación).
 * - Alternativa textual (tabla) para lectores de pantalla.
 * - Usa role="img" y aria-labelledby/aria-describedby para describir la visualización.
 */
export default function IngresosChart({ data, title = 'Ingresos por hora' }) {
  const reducedMotion = usePrefersReducedMotion();
  const titleId = useId();
  const descId = useId();

  const maxIngreso = useMemo(() => Math.max(...data.map((d) => d.ingresos)), [data]);

  return (
    <section className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 mt-8" aria-labelledby={titleId}>
      <h2 id={titleId} className="text-xl font-bold text-gray-800 mb-4">
        {title}
      </h2>

      <p id={descId} className="text-sm text-gray-500 mb-4">
        Ingresos simulados. Máximo del periodo: {maxIngreso}.
      </p>

      {/* Contenedor visual de la gráfica */}
      <div
        className="w-full h-64"
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#0052CC"
              strokeWidth={3}
              dot={false}
              isAnimationActive={!reducedMotion}
              // Accesibilidad: animación breve cuando está activada
              animationDuration={reducedMotion ? 0 : 250}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alternativa textual (oculta visualmente) para lectores de pantalla */}
      <div className="sr-only" aria-label="Datos de ingresos en formato tabla">
        <table>
          <thead>
            <tr>
              <th scope="col">Hora</th>
              <th scope="col">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.hora}>
                <td>{row.hora}</td>
                <td>{row.ingresos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


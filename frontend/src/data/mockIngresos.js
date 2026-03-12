/**
 * Datos mock de ingresos para el Dashboard (por hora en un día típico o por día en una semana).
 * En producción vendrían de la API.
 */
// Ingresos por hora en un día típico (ej. 6:00–22:00)
export const ingresosPorHora = [
  { hora: '06:00', ingresos: 120 },
  { hora: '08:00', ingresos: 450 },
  { hora: '10:00', ingresos: 680 },
  { hora: '12:00', ingresos: 920 },
  { hora: '14:00', ingresos: 740 },
  { hora: '16:00', ingresos: 580 },
  { hora: '18:00', ingresos: 890 },
  { hora: '20:00', ingresos: 620 },
  { hora: '22:00', ingresos: 310 },
];

// Ingresos por día en una semana (alternativa)
export const ingresosPorDia = [
  { dia: 'Lun', ingresos: 3200 },
  { dia: 'Mar', ingresos: 4100 },
  { dia: 'Mié', ingresos: 3800 },
  { dia: 'Jue', ingresos: 4500 },
  { dia: 'Vie', ingresos: 5200 },
  { dia: 'Sáb', ingresos: 4800 },
  { dia: 'Dom', ingresos: 2900 },
];

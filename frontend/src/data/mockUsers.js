/**
 * Datos mock de usuarios registrados para el Dashboard de Administrador.
 * En producción estos datos vendrían de la API/BD.
 */
export const mockUsers = [
  { id: 1, nombre: 'Ana García López', email: 'ana.garcia@email.com', fechaRegistro: '2025-01-15', estado: 'Activo' },
  { id: 2, nombre: 'Carlos Mendoza', email: 'carlos.m@email.com', fechaRegistro: '2025-01-18', estado: 'Activo' },
  { id: 3, nombre: 'María Fernández', email: 'maria.f@email.com', fechaRegistro: '2025-02-01', estado: 'Inactivo' },
  { id: 4, nombre: 'Roberto Sánchez', email: 'roberto.s@email.com', fechaRegistro: '2025-02-10', estado: 'Activo' },
  { id: 5, nombre: 'Laura Martínez', email: 'laura.mtz@email.com', fechaRegistro: '2025-02-14', estado: 'Activo' },
  { id: 6, nombre: 'José Hernández', email: 'jose.h@email.com', fechaRegistro: '2025-02-20', estado: 'Inactivo' },
  { id: 7, nombre: 'Patricia Ruiz', email: 'patricia.r@email.com', fechaRegistro: '2025-03-01', estado: 'Activo' },
  { id: 8, nombre: 'Miguel Torres', email: 'miguel.t@email.com', fechaRegistro: '2025-03-05', estado: 'Activo' },
  { id: 9, nombre: 'Sandra Díaz', email: 'sandra.d@email.com', fechaRegistro: '2025-03-08', estado: 'Activo' },
  { id: 10, nombre: 'Francisco López', email: 'francisco.l@email.com', fechaRegistro: '2025-03-10', estado: 'Activo' },
];

/** Tamaño de página para paginación simulada */
export const USERS_PAGE_SIZE = 10;

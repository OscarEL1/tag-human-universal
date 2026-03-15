/**
 * GUÍA DE PRUEBAS DE RUTA (TESTS MANUALES)
 * Objetivo: Validar la resiliencia y accesibilidad de la navegación.
 */

export const routeTests = {
  test404: "Escribir una URL inexistente (ej: /pwa/inventada). Resultado esperado: Mostrar Error404.jsx.",
  test500: "Simular caída de API en el Login. Resultado esperado: Mostrar Error500.jsx o Alerta de error.",
  testBreadcrumbs: "Navegar a /register. Resultado esperado: El Breadcrumb debe mostrar 'Inicio / Register' y ser clicable por teclado.",
  testA11y: "Usar un lector de pantalla en el formulario. Resultado esperado: Los errores deben ser anunciados por 'aria-live'."
};
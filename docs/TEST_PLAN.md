# 🧪 Plan de Pruebas Maestro - Tag Human Universal

## 1. Alcance de Navegadores (Browser Support)
* **Nivel 1 (Crítico):**
  * [ ] **Chrome Mobile (Android):** Motor principal.
  * [ ] **Safari (iOS):** Crítico para iPhones.
  * [ ] **Chrome Desktop:** Para pruebas rápidas.

## 2. Inventario de Dispositivos (Test Lab)
| Dueño | Dispositivo | OS Versión | Rol a Probar |
| :--- | :--- | :--- | :--- |
| (Tu Nombre) | Samsung A54 | Android 14 | Repartidor |
| (Dev Front) | iPhone 12 | iOS 17 | Guardia |

## 3. Escenarios de Prueba de Resiliencia y Flujo Crítico

### TC-01: Happy Path - Ciclo de Acceso Universal
**Actor:** Repartidor y Guardia.
1. **Registro/Login:** Acceso exitoso al dashboard.
2. **Generación:** Creación de QR dinámico funcional.
3. **Validación:** El guardia escanea y el sistema autoriza en < 2s.

### TC-02: Sad Path - Resiliencia de Red (Offline)
**Escenario:** El usuario intenta generar un QR sin conexión.
1. Simular estado "Offline" en el navegador (Network tab).
2. Intentar generar QR.
**Resultado esperado:**
- Feedback visual claro (Toast/Alerta).
- **Accesibilidad:** Uso de `aria-live="assertive"` para notificar el fallo de red inmediatamente.
- No permitir estados de carga (spinners) infinitos.

### TC-03: Sad Path - Seguridad JWT
**Escenario:** Acceso a rutas protegidas sin Token.
1. Intentar ingresar a `/app/qr` o rutas de admin manualmente sin login.
**Resultado esperado:** El sistema debe detectar la falta de JWT y redirigir a Login.

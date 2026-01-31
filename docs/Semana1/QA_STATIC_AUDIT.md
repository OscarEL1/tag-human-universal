# 🛡️ Reporte de Validación Estática (Sprint R1)

## A. Auditoría de Base de Datos (Backend)
*Objetivo: Verificar que la BD soporte las reglas de negocio.*

| Requisito | Verificación (Tech Lead) | Estado | Comentarios QA |
| :--- | :--- | :--- | :--- |
| **Notificaciones** | ¿La tabla `residents` tiene campo para `telefono`? | [x] | (Ej. Sí, es VARCHAR(20)) |
| **Integridad** | ¿La tabla `access_logs` vincula al `user_id` (Guardia/Driver)? | [x] | |
| **Seguridad** | ¿La tabla `users` tiene el campo `secret_totp` para el QR? | [x] | |

## B. Auditoría de UX/UI (Frontend)
*Referencia: Documento "Semana 3 Wireframes.pdf" (Nielsen & WCAG)*

### 1. Pantalla Registro
* **Heurística 5 (Prevención de Errores):**
    * [x] ¿El diseño muestra claramente qué formato deben tener las placas? (Ej. "Entre 5 y 8 caracteres").
* **WCAG 2.1 (Accesibilidad):**
    * [-] ¿Los campos tienen etiquetas (Labels) claras fuera del input?

### 2. Pantalla QR (Repartidor)
* **Heurística 1 (Estado del Sistema):**
    * [x] ¿El diseño incluye la **Barra de Progreso** o contador de 30s? (Crítico).
* **Heurística 8 (Minimalismo):**
    * [x] ¿Se eliminó información innecesaria? (Solo debe estar el QR y el timer).

### 3. Pantalla Validación (Guardia)
* **Heurística 2 (Mundo Real):**
    * [x] ¿La **FOTO** del repartidor es el elemento más grande para comparar con la cara real?
* **Accesibilidad (Daltónicos):**
    * [x] ¿El estado "Autorizado" (Verde) y "Denegado" (Rojo) usa también **ICONOS** (Check/Cruz) y no solo color?
* **Salida de Emergencia:**
    * [-] ¿Existe un botón de "Cancelar" o "Volver" si el guardia se equivocó al escanear?

---
**CONCLUSIÓN DEL QA:**
"Se requieren cambios en la pantalla de registro y en la pantalla de validación"
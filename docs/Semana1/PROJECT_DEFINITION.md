
# 📄 Documento de Definición del Proyecto: Tag Human Universal

**Versión:** 1.0.0 | **Fecha:** Enero 2026 | **Estado:** Fase de Arquitectura (R1)

----------

## 1. Resumen Ejecutivo

**Tag Human Universal** es una plataforma de **Identidad Digital Segura** para el control de accesos en fraccionamientos residenciales. Sustituye las bitácoras de papel y la retención de identificaciones físicas (INE) por un sistema de **Códigos QR Dinámicos (TOTP)**.

Nuestro objetivo es reducir el tiempo de ingreso de repartidores de **3 minutos a 15 segundos**, garantizando la validación de identidad y aumentando la seguridad del residente mediante trazabilidad digital.

----------

## 2. El Problema (Pain Points)

El sistema actual de control de accesos en Tehuacán es obsoleto y presenta tres fallas críticas:

1.  **Vulnerabilidad de Datos (Privacidad):** Las bitácoras de papel exponen nombres y placas de visitantes anteriores a cualquiera que las lea.
    
2.  **Cuello de Botella Operativo (Latencia):** El proceso manual (detenerse, quitarse guantes, escribir, verificar) genera filas en horas pico.
    
3.  **Suplantación de Identidad:** No existen herramientas para validar si la persona es quien dice ser. Un repartidor puede dar un nombre falso y el guardia no tiene cómo verificarlo al instante.
    

----------

## 3. La Solución y Propuesta de Valor

Desarrollaremos una **Web App Progresiva (PWA)** accesible desde cualquier navegador móvil, sin instalaciones pesadas.

### Funcionalidades Clave (Core):

-   **QR Dinámico:** El código de acceso cambia cada 30 segundos (algoritmo TOTP), haciendo inútiles las capturas de pantalla robadas.
    
-   **Validación Visual:** Al escanear, el guardia recibe en su tablet una **FOTO GIGANTE** del rostro del repartidor y sus placas para confirmar visualmente la identidad.
    
-   **Registro Único:** El repartidor se registra una vez y entra a múltiples fraccionamientos afiliados.
    

----------

## 4. Identificación de Usuarios (Stakeholders)


| Usuario | Perfil | Necesidad Principal |
| :--- | :--- | :--- |
| **El Repartidor** ("Lan") | Joven, usa moto, prisa constante. | **Velocidad.** "No quiero quitarme el casco ni los guantes." |
| **El Guardia** | Turnos largos, poca familiaridad tecnológica. | **Claridad.** Botones grandes y decisión simple (Pasa/No Pasa). |
| **El Residente** | Vive en el fraccionamiento. | **Seguridad.** Saber quién entra a su casa sin gestionar invitaciones manuales. |

----------

## 5. Alcance del Proyecto (MVP)

Debido al cronograma académico de 3 meses, definimos estrictamente el alcance para las rotaciones R1 y R2.

### ✅ Alcance IN (Se construye ahora)

-   Registro de usuarios con subida de Foto e INE.
    
-   Motor de generación de QR Dinámico (basado en tiempo).
    
-   Escáner Web para la terminal del Guardia.
    
-   Validación de acceso y visualización de perfil.
    
-   Historial de accesos (Logs).
    

### ❌ Alcance OUT (Se descarta por ahora)

-   Invitaciones generadas por residentes (Modelo "Identity-First", no "Event-First").
    
-   Pasarelas de pago o suscripciones.
    
-   Reconocimiento facial biométrico automatizado (la validación es humana).
    
-   Aplicaciones nativas (Android/iOS).
    

----------

## 6. Arquitectura Técnica

El sistema opera bajo un esquema de **Monorepo** contenerizado.

### Stack Tecnológico (The Modern Hybrid)

-   **Frontend:** React + Vite (PWA).
    
    -   _Justificación:_ Acceso a cámara nativa vía navegador, despliegue instantáneo y modo offline básico.
        
-   **Backend:** Node.js + Express.
    
    -   _Justificación:_ Agilidad de desarrollo, manejo robusto de JSON y librerías de criptografía (TOTP) maduras.
        
-   **Base de Datos:** PostgreSQL.
    
    -   _Justificación:_ Integridad relacional estricta para vincular `Usuarios` <-> `Accesos` <-> `Roles`.
        
-   **Infraestructura:** Docker & Docker Compose.
    
    -   _Justificación:_ Estandarización del entorno de desarrollo entre Windows/Mac/Linux.
        

### Mapa de Navegación (Sitemap)

1.  **Ruta Pública:** `/login`, `/register`
    
2.  **Ruta Driver:** `/app/qr` (Pantalla de Pase)
    
3.  **Ruta Guard:** `/admin/scanner` -> `/admin/validate/:id`
    

----------

## 7. Roadmap de Desarrollo (Metodología de Rotación)

El proyecto se gestiona mediante **Sprints alineados a Roles**, donde el Tech Lead cambia en cada fase.

-   **Fase 1: Cimientos (Sprint R1 - Ene 27)**
    
    -   _Entregable:_ Infraestructura Docker, Repo Configurado, Diseño de BD y Wireframes Aprobados.
        
-   **Fase 2: Core Funcional (Sprint R2 - Feb 18)**
    
    -   _Entregable:_ MVP funcional. Registro, Login, Generación y Escaneo de QR.
        
-   **Fase 3: Integración (Sprint R3 - Mar 11)**
    
    -   _Entregable:_ Notificaciones, Dashboard de Admin y Despliegue en Servidor.
        
-   **Fase 4: Pulido Final (Sprint R4 - Abr 13)**
    
    -   _Entregable:_ UX/UI final, Accesibilidad (A11y), PWA Offline y Documentación de usuario.
        

----------

## 8. Equipo y Roles (Rotación R1 Actual)


| Rol | Matrícula | Responsabilidad Principal |
| :--- | :--- | :--- |
| **Tech Lead** | ...665 | Arquitectura, Gitflow y Code Review. |
| **Frontend** | ...936 | UX/UI, Wireframes y Maquetación React. |
| **Backend** | ...137 | Base de Datos y API REST. |
| **DevOps** | ...560 | Docker y CI/CD. |
| **QA** | ...120 | Plan de Pruebas y Prevención de Bugs. |
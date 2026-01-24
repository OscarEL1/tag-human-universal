
# 🛠️ Stack Tecnológico y Decisiones de Arquitectura

> **Proyecto:** Tag Human Universal **Fecha de Definición:** Enero 2026 (Sprint R1)

Este documento detalla las tecnologías seleccionadas para la construcción del MVP y la justificación técnica de cada una.

## 1. Frontend (Cliente)

**Objetivo:** Interfaz rápida, ligera y capaz de funcionar con conexiones inestables (PWA).

-   **Framework:** **React 18**
    
    -   _Justificación:_ Ecosistema maduro, manejo eficiente del DOM y facilidad para crear componentes interactivos (Scanner, QR Timer).
        
-   **Build Tool:** **Vite**
    
    -   _Justificación:_ Tiempos de arranque instantáneos y Hot Module Replacement (HMR) superior a Create-React-App. Vital para la velocidad de desarrollo.
        
-   **Lenguaje:** **JavaScript (ES6+)**
    
    -   _Nota:_ Se prioriza la agilidad del equipo en R1/R2.
        
-   **Routing:** **React Router DOM v6**
    
    -   _Uso:_ Manejo de rutas protegidas (`/admin`, `/app`) y navegación SPA (Single Page Application).
        
-   **Librerías Clave:**
    
    -   `html5-qrcode`: Para acceso a cámara y lectura de QR en el navegador.
        
    -   `qrcode.react`: Para renderizado eficiente del código QR dinámico.
        

## 2. Backend (Servidor API)

**Objetivo:** API RESTful escalable, segura y con manejo criptográfico robusto.

-   **Runtime:** **Node.js v18 (LTS)**
    
    -   _Justificación:_ Arquitectura orientada a eventos (Non-blocking I/O) ideal para manejar múltiples peticiones de escaneo simultáneas. Permite compartir lógica (validaciones) con el Frontend.
        
-   **Framework:** **Express.js**
    
    -   _Justificación:_ Minimalista, flexible y estándar de la industria. Fácil curva de aprendizaje para el equipo.
        
-   **Seguridad & Auth:**
    
    -   **JWT (JSON Web Tokens):** Para manejo de sesiones sin estado (Stateless).
        
    -   **Bcrypt / Argon2:** Hashing de contraseñas.
        
    -   **OTPLib:** Implementación del estándar RFC 6238 (TOTP) para la generación y validación de códigos temporales.
        

## 3. Base de Datos (Persistencia)

**Objetivo:** Integridad referencial estricta y seguridad de datos.

-   **Motor:** **PostgreSQL 15**
    
    -   _Justificación:_ A diferencia de NoSQL, Postgres garantiza integridad ACID. Es crítico que no existan registros de acceso "huérfanos" (sin usuario asociado).
        
-   **Modelado:** Relacional.
    
    -   Tablas principales: `Users`, `Roles`, `Access_Logs`, `Residents`.
        
-   **Driver:** `node-postgres` (pg) o un ORM ligero (como Prisma o Sequelize, a definir por el Backend Lead).
    

## 4. Infraestructura & DevOps

**Objetivo:** "Write once, run anywhere". Eliminar el "en mi máquina sí funciona".

-   **Contenedores:** **Docker**
    
    -   _Uso:_ Empaquetado de la aplicación y la base de datos para garantizar que todo el equipo (Windows/Mac/Linux) tenga el mismo entorno.
        
-   **Orquestación Local:** **Docker Compose**
    
    -   _Configuración:_ Levanta simultáneamente el servicio `frontend`, `backend` y `database` con persistencia de volúmenes.
        
-   **Control de Versiones:** **Git + GitHub**
    
    -   _Estrategia:_ Gitflow Simplificado (`main` protegida, desarrollo en `develop`).
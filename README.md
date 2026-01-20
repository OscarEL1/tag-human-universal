# 🏷️ Tag Human Universal

> Sistema de Control de Acceso e Identidad Digital con QR Dinámico (TOTP).

![Status](https://img.shields.io/badge/Status-En_Desarrollo-yellow)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED)

## 📖 Descripción
**Tag Human Universal** soluciona la inseguridad y lentitud en los accesos a fraccionamientos. Reemplaza las bitácoras de papel y las identificaciones físicas por una **Identidad Digital Segura** basada en códigos QR que cambian cada 30 segundos, vinculando de forma inmutable al visitante con su registro.

## 🛠️ Tech Stack
Este proyecto opera bajo una arquitectura de **Monorepo**:

* **Frontend (PWA):** React + Vite (Web App progresiva para Repartidores y Guardias).
* **Backend (API):** Node.js + Express (Gestión de usuarios y criptografía).
* **Base de Datos:** PostgreSQL (Relacional).
* **Infraestructura:** Docker & Docker Compose.

## 🚀 Instalación y Uso (Quick Start)

### Prerrequisitos
* Docker Desktop instalado y corriendo.
* Node.js v18+ (Opcional, solo para scripts locales).

### Levantar el entorno
El proyecto está contenerizado. No necesitas instalar bases de datos locales.

```bash
# 1. Clonar el repositorio
git clone [https://github.com/depOscar1zero/tag-human-universal.git](https://github.com/depOscar1zero/tag-human-universal.git)
cd tag-human-universal

# 2. Levantar servicios (Backend + Frontend + DB)
npm run docker:up

# La App estará disponible en: http://localhost:5173
# La API estará disponible en: http://localhost:3000
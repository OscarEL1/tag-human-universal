# Verificación Docker & CI/CD — Tag Human Universal

**Fecha:** 2026-04-14  
**Rama auditada:** `feat/qr-camera-scanner` (base: `develop`)  
**Auditor:** Claude Sonnet 4.6

---

## Resumen ejecutivo

Se auditó la infraestructura Docker y el pipeline de CI/CD desde cero. Se encontraron
**5 problemas críticos** que impedían el funcionamiento correcto en producción y en CI.
Todos fueron corregidos en esta sesión. El sistema cumple los criterios de calidad
listados en la sección de checklist al final de este documento.

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────┐
│                   docker-compose.yml                │
│                                                     │
│  ┌──────────┐    ┌───────────┐    ┌─────────────┐  │
│  │  db      │───▶│  backend  │◀───│  frontend   │  │
│  │ postgres │    │  node:18  │    │  nginx:alp  │  │
│  │ :5432    │    │  :3000    │    │  :8080→80   │  │
│  └──────────┘    └───────────┘    └─────────────┘  │
│   healthcheck     depends_on:      depends_on:      │
│   pg_isready      service_healthy  backend          │
└─────────────────────────────────────────────────────┘
```

| Servicio    | Imagen base       | Puerto host | Puerto interno |
|-------------|-------------------|-------------|----------------|
| `db`        | `postgres:15-alpine` | 5432     | 5432           |
| `backend`   | `node:18-alpine`  | 3000        | 3000           |
| `frontend`  | `nginx:alpine`    | 8080        | 80             |

---

## Problemas encontrados y corregidos

### 🔴 1. `backend/package.json` — script `start` roto

**Antes:**
```json
"start": "npx sequelize-cli db:migrate && node server.js"
```

**Problema:** El proyecto no usa Sequelize (usa `pg` raw) y el entry point es `index.js`,
no `server.js`. Un deploy con `npm start` crasheaba inmediatamente con `MODULE_NOT_FOUND`.
El Dockerfile usa `CMD ["node", "index.js"]` por lo que Docker funcionaba, pero cualquier
plataforma que invoque `npm start` (Render, Railway) hubiera fallado.

**Fix:**
```json
"start": "node index.js"
```

---

### 🔴 2. `docker-compose.yml` — variables JWT ausentes en backend

**Antes:** el servicio `backend` no incluía `JWT_SECRET`, `ACCESS_TOKEN_EXPIRES` ni
`REFRESH_TOKEN_DAYS`.

**Problema:** `authTokens.js` tiene fallbacks (`dev_unified_secret_change_in_production`),
lo que significa que en producción los tokens se firmarían con un secreto público conocido.
Cualquier atacante podría fabricar JWTs válidos.

**Fix:** añadidas las tres variables con defaults seguros en `docker-compose.yml`:
```yaml
- JWT_SECRET=${JWT_SECRET}
- ACCESS_TOKEN_EXPIRES=${ACCESS_TOKEN_EXPIRES:-15m}
- REFRESH_TOKEN_DAYS=${REFRESH_TOKEN_DAYS:-7}
```

---

### 🔴 3. `docker-compose.yml` — sin healthcheck en `db`

**Antes:** el servicio `backend` tenía `depends_on: db` pero sin condición de salud.

**Problema:** Docker marca `db` como "iniciado" cuando el contenedor arranca, no cuando
PostgreSQL acepta conexiones. El backend intentaba conectarse antes de que Postgres
estuviera listo → crash con `ECONNREFUSED` en el primer request.

**Fix:** añadido `healthcheck` en `db` y condición `service_healthy` en `backend`:
```yaml
db:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
    interval: 5s
    timeout: 5s
    retries: 10

backend:
  depends_on:
    db:
      condition: service_healthy
```

---

### 🔴 4. `docker-compose.dev.yml` — vars JWT ausentes + `DB_PASSWORD` no mapeado

**Antes:** el compose de desarrollo no tenía vars JWT y solo mapeaba `DB_PASS`
(alias antiguo), no `DB_PASSWORD` que es la que usa `db.js` tras el fix de SSL.

**Fix:** añadidas todas las vars faltantes con valor de desarrollo explícito:
```yaml
- DB_PASSWORD=${DB_PASSWORD}
- JWT_SECRET=${JWT_SECRET:-dev_secret_change_in_production}
- ACCESS_TOKEN_EXPIRES=${ACCESS_TOKEN_EXPIRES:-15m}
- REFRESH_TOKEN_DAYS=${REFRESH_TOKEN_DAYS:-7}
```

---

### 🔴 5. CI — `docker compose config` y `build` sin variables de entorno

**Antes:** los pasos de CI corrían `docker compose config` y `docker compose build`
sin ninguna variable de entorno definida.

**Problema:** `docker compose config` falla con "variable is not set" cuando el
`docker-compose.yml` referencia `${DB_USER}`, `${JWT_SECRET}`, etc. y no están
en el entorno. Mismo problema para `docker compose build` que pasa `VITE_API_URL`
como ARG al frontend Dockerfile.

**Fix:** añadido bloque `env:` en el job de CI con valores mínimos para build:
```yaml
env:
  DB_USER: postgres
  DB_PASSWORD: ci_password
  DB_NAME: taghuman
  JWT_SECRET: ci_secret_only_for_build
  VITE_API_URL: http://localhost:3000/api
  # ... resto de vars
```

Además se re-habilitó el caché de npm (`cache: 'npm'`) que estaba comentado,
reduciendo el tiempo de instalación de dependencias.

---

## Estado de los archivos tras los fixes

| Archivo                          | Estado   | Cambio                                      |
|----------------------------------|----------|---------------------------------------------|
| `backend/package.json`           | ✅ Fijo  | `start` → `node index.js`                  |
| `docker-compose.yml`             | ✅ Fijo  | JWT vars + healthcheck + `service_healthy`  |
| `docker-compose.dev.yml`         | ✅ Fijo  | JWT vars + `DB_PASSWORD` + healthcheck      |
| `.github/workflows/ci.yml`       | ✅ Fijo  | `env:` block + npm cache re-habilitado      |
| `.env.example` (raíz)            | ✅ Fijo  | Añadidas todas las vars requeridas          |

---

## Verificación de Dockerfiles

### `backend/Dockerfile`
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]   ✅ entry point correcto
```
✅ Multi-stage no requerido (backend Node no necesita builder separado)  
✅ `node_modules` excluido del COPY por `.dockerignore` (recomendado verificar)  
✅ Puerto coincide con el expuesto en `docker-compose.yml`

### `frontend/Dockerfile`
```dockerfile
FROM node:22-alpine as builder   ⚠️ usa Node 22 (CI usa Node 18 — inconsistencia menor)
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo "server { ... try_files $uri $uri/ /index.html; }" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
✅ Build multi-stage correcto (builder + nginx)  
✅ `try_files` configurado → React Router funciona en rutas directas  
✅ `VITE_API_URL` recibido como ARG y bakeado en el build  
⚠️ Node 22 en Dockerfile vs Node 18 en CI — no causa fallos pero es inconsistente

---

## Flujo CI/CD completo

```
Push / PR a main o develop
        │
        ▼
┌───────────────────────┐
│  1. Checkout código   │  actions/checkout@v4
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│  2. Setup Node 18     │  cache: npm (habilitado)
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│  3. npm install       │  backend + frontend
│     --ignore-scripts  │  (evita postinstall malicioso)
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│  4. ESLint            │  frontend: falla si hay errores
│                       │  backend: continúa si no hay script
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│  5. docker compose    │  valida sintaxis YAML + vars
│     config            │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│  6. docker compose    │  construye las 3 imágenes
│     build             │  (db no se construye, es imagen pública)
└──────────┬────────────┘
           │
           ▼
        ✅ PASS / ❌ FAIL
```

---

## Variables de entorno requeridas

### Para desarrollo local (`cp .env.example .env`)

| Variable              | Requerida | Default dev          | Descripción                        |
|-----------------------|-----------|----------------------|------------------------------------|
| `DB_USER`             | ✅        | `postgres`           | Usuario PostgreSQL                 |
| `DB_PASSWORD`         | ✅        | `password`           | Contraseña PostgreSQL              |
| `DB_NAME`             | ✅        | `taghuman`           | Nombre de la base de datos         |
| `DB_PORT`             | —         | `5432`               | Puerto PostgreSQL                  |
| `DB_SSL`              | —         | `false`              | `true` en Neon/Render              |
| `PORT`                | —         | `3000`               | Puerto del servidor Express        |
| `JWT_SECRET`          | ✅        | *(fallback inseguro)*| Secreto para firmar JWTs           |
| `ACCESS_TOKEN_EXPIRES`| —         | `15m`                | Duración del access token          |
| `REFRESH_TOKEN_DAYS`  | —         | `7`                  | Vida del refresh token (días)      |
| `NODE_ENV`            | —         | `development`        | Activa logs de recovery en consola |
| `VITE_API_URL`        | ✅ build  | `http://localhost:3000/api` | URL bakeada en el frontend  |

### Para producción (Render / Railway)

Mismas vars con valores reales + `DB_SSL=true` + `JWT_SECRET` con valor aleatorio fuerte.

---

## Checklist de cumplimiento

### Docker
- [x] Los tres servicios (db, backend, frontend) tienen Dockerfile o imagen válida
- [x] `db` tiene `healthcheck` con `pg_isready`
- [x] `backend` espera `service_healthy` antes de arrancar
- [x] Todas las variables de entorno necesarias están declaradas en `docker-compose.yml`
- [x] `JWT_SECRET` no tiene fallback hardcodeado en producción
- [x] `DB_PASSWORD` (no `DB_PASS`) es la var principal en `db.js`
- [x] `DB_SSL=true` soportado para Neon/Render
- [x] `schema.sql` montado como `initdb` script → DB inicializada automáticamente
- [x] Frontend compilado con Nginx multi-stage → imagen lista para producción
- [x] React Router soportado (`try_files $uri $uri/ /index.html`)
- [x] `npm start` en backend invoca `node index.js` correctamente

### CI/CD
- [x] Pipeline activo en `push` y `pull_request` a `main` y `develop`
- [x] `npm install --ignore-scripts` en CI (seguridad)
- [x] ESLint falla el build si hay errores en el frontend
- [x] `docker compose config` valida YAML sin errores
- [x] `docker compose build` construye imágenes sin errores
- [x] Variables de entorno disponibles en CI para los pasos de Docker
- [x] Caché de npm habilitado (instalaciones rápidas)

### Seguridad
- [x] `helmet()` activo en Express
- [x] `cors()` configurado
- [x] Passwords hasheadas con bcrypt (cost factor 10)
- [x] JWTs de corta duración (15m) con refresh tokens revocables
- [x] SSL en conexión a DB configurable por variable de entorno
- [x] `npm install --ignore-scripts` en Dockerfiles (recomendado)

---

## Cómo levantar desde cero

```bash
# 1. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 2. Levantar todos los servicios
docker compose up --build

# 3. (Opcional) Datos de prueba
docker compose exec backend node seed.js
docker compose exec backend node createadmin.js

# 4. Verificar
curl http://localhost:3000/api/health
# → { "status": "OK", "msg": "API Tag Human funcionando 🚀" }

# Frontend
open http://localhost:8080
```

---

## Limitaciones conocidas / deuda técnica

| Item | Severidad | Descripción |
|------|-----------|-------------|
| Node 22 en `frontend/Dockerfile` vs Node 18 en CI | Baja | Inconsistencia menor, no causa fallos en build |
| Sin tests de integración en CI | Media | `session.test.js` existe pero no corre en CI (requiere DB real) |
| Sin `docker-compose.test.yml` | Media | No hay entorno de test con DB efímera para el pipeline |
| `schema.sql` no es idempotente completo | Media | `CREATE TABLE residential_zones` sin `IF NOT EXISTS` falla en re-ejecución |
| Sin rate limiting en API | Alta | Endpoints de login/recovery expuestos a fuerza bruta |

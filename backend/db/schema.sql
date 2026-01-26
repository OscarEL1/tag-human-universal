-- 1. Tabla USERS (Sin cambios)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    placas VARCHAR(20),
    foto_url TEXT,
    rol VARCHAR(20) NOT NULL,
    secret_totp VARCHAR(100)
);

-- 2. Tabla RESIDENTS (Sin cambios)
CREATE TABLE residents (
    id SERIAL PRIMARY KEY,
    telefono VARCHAR(20) NOT NULL,
    numero_casa VARCHAR(10) NOT NULL
);

-- 3. Tabla ACCESSLOGS (ACTUALIZADA ⚠️)
-- Se agregó columna 'tipo' para diferenciar Entrada de Salida
CREATE TABLE access_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(10) NOT NULL,  -- Valores: 'ENTRADA' o 'SALIDA'
    status VARCHAR(20) NOT NULL -- 'granted' o 'denied'
);
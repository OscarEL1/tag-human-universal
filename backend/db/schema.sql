-- Tabla de Usuarios (Guardias, Repartidores, Admin)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'guard', 'driver')) NOT NULL,
    plates VARCHAR(20), -- Solo para drivers
    secret_totp TEXT,   -- Para 2FA del repartidor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Residentes (Quienes reciben paquetes)
CREATE TABLE IF NOT EXISTS residents (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Bitácora de Accesos
CREATE TABLE IF NOT EXISTS access_logs (
    id SERIAL PRIMARY KEY,
    driver_id INT REFERENCES users(id),
    resident_id INT REFERENCES residents(id),
    status VARCHAR(20) CHECK (status IN ('allowed', 'denied')) NOT NULL,
    qr_code_data TEXT, 
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- 4. Tabla RESIDENTIAL ZONES (Multitenant)
-- -----------------------------------------------------
CREATE TABLE residential_zones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- 5. ACTUALIZACIÓN: Relación Users -> Zones
-- -----------------------------------------------------
ALTER TABLE users ADD COLUMN zone_id INT;
ALTER TABLE users ADD CONSTRAINT fk_zone FOREIGN KEY (zone_id) REFERENCES residential_zones(id) ON DELETE SET NULL;

-- Sesiones (refresh hasheado; multisesión)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    refresh_expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_hash ON user_sessions(refresh_token_hash);

-- Recuperación de contraseña (token hasheado)
CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_phone_used ON password_resets(phone, used);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON password_resets(expires_at);

-- Recuperación por OTP (sistema separado; no usa password_resets)
CREATE TABLE IF NOT EXISTS otp_codes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON otp_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON otp_codes(expires_at);

CREATE TABLE IF NOT EXISTS otp_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_otp_reset_tokens_user_id ON otp_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_reset_tokens_hash_used ON otp_reset_tokens(token_hash, used);

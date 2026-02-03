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

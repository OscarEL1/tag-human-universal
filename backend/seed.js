const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Configuración de conexión manual para脚本 independiente
// Asumimos que corre DENTRO del contenedor, donde las vars de entorno existen
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'taghuman',
    password: process.env.DB_PASS || process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function seed() {
    try {
        console.log('🌱 Iniciando semilla de datos...');

        // 1. Crear Zona "Bosques de Puebla"
        // Usamos ON CONFLICT DO NOTHING si el nombre es único, pero residential_zones no tiene constraint unique en nombre por defecto segun schema.sql previo.
        // Haremos un SELECT primero para evitar duplicados masivos si se corre varias veces.

        let zoneId;
        const checkZone = await pool.query("SELECT id FROM residential_zones WHERE nombre = $1", ['Bosques de Puebla']);

        if (checkZone.rows.length > 0) {
            zoneId = checkZone.rows[0].id;
            console.log(`ℹ️ La zona 'Bosques de Puebla' ya existe (ID: ${zoneId}).`);
        } else {
            const zoneRes = await pool.query(
                "INSERT INTO residential_zones (nombre, ubicacion) VALUES ($1, $2) RETURNING id",
                ['Bosques de Puebla', 'Zona Norte #45']
            );
            zoneId = zoneRes.rows[0].id;
            console.log(`✅ Zona creada: Bosques de Puebla (ID: ${zoneId})`);
        }

        // 2. Crear Guardia "Juan"
        const phone = '5550001111';
        const checkUser = await pool.query("SELECT id FROM users WHERE phone = $1", [phone]);

        if (checkUser.rows.length > 0) {
            console.log(`ℹ️ El usuario con teléfono ${phone} ya existe.`);
        } else {
            const password = '123456';
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const userRes = await pool.query(
                "INSERT INTO users (nombre, phone, password_hash, role, zone_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre",
                ['Guardia Juan', phone, hash, 'guard', zoneId]
            );
            console.log(`✅ Guardia creado: ${userRes.rows[0].nombre} (Password: ${password})`);
        }

    } catch (err) {
        console.error('❌ Error al sembrar datos:', err);
    } finally {
        await pool.end();
    }
}

seed();

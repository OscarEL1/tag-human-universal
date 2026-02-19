const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- SECRETOS ---
// Es vital que JWT_SECRET esté definido en .env para producción.
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

// 1. REGISTRO (Solo para Drivers públicos)
const register = async (req, res) => {
    // Extraemos datos. Note que 'role' y 'zone_id' se definen internamente por seguridad.
    const { nombre, phone, password, plates } = req.body;

    // Validación básica de entrada
    if (!nombre || !phone || !password) {
        return res.status(400).json({ msg: 'Por favor complete todos los campos requeridos (nombre, teléfono, contraseña).' });
    }

    // Validación específica para conductores
    if (!plates) {
        return res.status(400).json({ msg: 'Las placas son obligatorias para el registro de conductores.' });
    }

    try {
        // A. Verificar existencia del usuario (Evitar duplicados)
        const userExist = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ msg: 'El usuario ya está registrado con este teléfono.' });
        }

        // B. Hashing de password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // LÓGICA MULTITENANT & ROLES:
        // Al ser un endpoint público, forzamos el rol 'driver' y zone_id NULL.
        // Esto previene que alguien se registre arbitrariamente como admin.
        const role = 'driver';
        const assignedZone = null;

        // C. Insertar en BD
        const newUser = await pool.query(
            `INSERT INTO users (nombre, phone, password_hash, role, plates, secret_totp, zone_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, nombre, role, zone_id`,
            [nombre, phone, passwordHash, role, plates, null, assignedZone]
        );

        const user = newUser.rows[0];

        // D. Generar Token (Incluyendo zone_id)
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                zone_id: user.zone_id
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            msg: 'Conductor registrado exitosamente',
            token,
            user
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

// 2. LOGIN (Para Todos: Guardias, Drivers, Admins)
const login = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ msg: 'Ingrese teléfono y contraseña' });
    }

    try {
        // A. Buscar usuario
        const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const user = userResult.rows[0];

        // B. Validar Password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // C. Generar Token
        // IMPORTANTE: Incluimos zone_id en el payload del token.
        // Esto permite al Frontend validar permisos de zona sin hacer peticiones extra.
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                zone_id: user.zone_id
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            msg: 'Login exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                role: user.role,
                zone_id: user.zone_id
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

module.exports = { register, login };
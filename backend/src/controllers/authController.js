const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

const register = async (req, res) => {
    // 1. Extraemos datos y definimos valores por defecto
    const { nombre, phone, password, plates, role, zone_id } = req.body;
    
    // Si no viene un rol (registro público), por defecto es 'driver'
    const finalRole = role || 'driver';
    // Si es registro público de conductor, la zona es NULL inicialmente
    const finalZone = zone_id || null;

    // 2. Validación básica de presencia
    if (!nombre || !phone || !password) {
        return res.status(400).json({ msg: 'Faltan campos obligatorios (nombre, teléfono, contraseña).' });
    }

    // 3. Validación CONDICIONAL de placas: Solo obligatorias si es CONDUCTOR
    if (finalRole === 'driver' && !plates) {
        return res.status(400).json({ msg: 'Las placas son obligatorias para conductores.' });
    }

    try {
        // A. Verificar si el teléfono ya existe
        const userExist = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ msg: 'El usuario ya está registrado con este teléfono.' });
        }

        // B. Hashing de password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // C. Insertar en BD (Soporta Multitenant: guarda el zone_id si viene del Admin)
        const newUser = await pool.query(
            `INSERT INTO users (nombre, phone, password_hash, role, plates, zone_id) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, nombre, role, zone_id`,
            [nombre, phone, passwordHash, finalRole, (finalRole === 'driver' ? plates : null), finalZone]
        );

        const user = newUser.rows[0];

        // D. Generar Token (Mantiene la sesión activa tras el registro)
        const token = jwt.sign(
            { id: user.id, role: user.role, zone_id: user.zone_id },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        // E. Respuesta única y clara
        res.status(201).json({
            msg: `${finalRole === 'guard' ? 'Guardia' : 'Conductor'} registrado exitosamente`,
            token,
            user
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ msg: 'Ingrese teléfono y contraseña' });
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, zone_id: user.zone_id },
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
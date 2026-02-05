const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- SECRETOS (Deberían ir en .env) ---
const JWT_SECRET = process.env.JWT_SECRET;

// 1. REGISTRO DE USUARIO
const register = async (req, res) => {
    const { nombre, phone, password, role, plates } = req.body;

    try {
        // A. Verificar si ya existe (Prevención de Errores - Nielsen #5)
        const userExist = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ msg: 'El usuario ya está registrado con este teléfono.' });
        }

        // B. Hashing de Contraseña (Requerimiento de Ciberseguridad)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // C. Insertar en BD
        const newUser = await pool.query(
            `INSERT INTO users (nombre, phone, password_hash, role, plates, secret_totp) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre, role`,
            [nombre, phone, passwordHash, role, plates || null, null] // TOTP se genera luego
        );

        // D. Crear Token (Sesión automática al registrarse)
        const token = jwt.sign({ id: newUser.rows[0].id, role: role }, JWT_SECRET, { expiresIn: '8h' });

        res.status(201).json({
            msg: 'Usuario creado exitosamente',
            token,
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// 2. LOGIN (Entrada)
const login = async (req, res) => {
    const { phone, password } = req.body;

    try {
        // A. Buscar usuario
        const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const user = userResult.rows[0];

        // B. Comparar Hash (Bcrypt)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // C. Generar Token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

        res.json({
            msg: 'Login exitoso',
            token,
            user: { id: user.id, nombre: user.nombre, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

module.exports = { register, login };
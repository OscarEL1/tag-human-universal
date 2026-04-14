const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { createSessionForUser } = require('../services/sessionService');

const register = async (req, res) => {
  const { nombre, phone, password, plates, role, zone_id } = req.body;

  const finalRole = role || 'driver';
  const finalZone = zone_id || null;

  if (!nombre || !phone || !password) {
    return res.status(400).json({ msg: 'Faltan campos obligatorios (nombre, teléfono, contraseña).' });
  }

  if (finalRole === 'driver' && !plates) {
    return res.status(400).json({ msg: 'Las placas son obligatorias para conductores.' });
  }

  try {
    const userExist = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ msg: 'El usuario ya está registrado con este teléfono.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (nombre, phone, password_hash, role, plates, zone_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, nombre, role, zone_id, plates`,
      [nombre, phone, passwordHash, finalRole, finalRole === 'driver' ? plates : null, finalZone]
    );

    const user = newUser.rows[0];
    const { accessToken, refreshToken } = await createSessionForUser(user, req);

    res.status(201).json({
      msg: `${finalRole === 'guard' ? 'Guardia' : 'Conductor'} registrado exitosamente`,
      token: accessToken,
      accessToken,
      refreshToken,
      user,
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

    const u = {
      id: user.id,
      nombre: user.nombre,
      role: user.role,
      zone_id: user.zone_id,
      plates: user.plates || null,
    };
    const { accessToken, refreshToken } = await createSessionForUser(u, req);

    res.json({
      msg: 'Login exitoso',
      token: accessToken,
      accessToken,
      refreshToken,
      user: u,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const getUsers = async (req, res) => {
  const { zone_id, page = 0, limit = 5 } = req.query;
  const pageNum = Math.max(0, parseInt(page, 10) || 0);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 5));
  const offset = pageNum * limitNum;

  try {
    let usersQuery, usersParams, countQuery, countParams;

    if (zone_id) {
      usersQuery = `
        SELECT id, nombre, phone AS telefono, role, created_at, zone_id
        FROM users
        WHERE zone_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      usersParams = [zone_id, limitNum, offset];
      countQuery = 'SELECT COUNT(*) FROM users WHERE zone_id = $1';
      countParams = [zone_id];
    } else {
      usersQuery = `
        SELECT id, nombre, phone AS telefono, role, created_at, zone_id
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      usersParams = [limitNum, offset];
      countQuery = 'SELECT COUNT(*) FROM users';
      countParams = [];
    }

    const [usersResult, countResult] = await Promise.all([
      pool.query(usersQuery, usersParams),
      pool.query(countQuery, countParams),
    ]);

    res.json({
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

module.exports = { register, login, getUsers };

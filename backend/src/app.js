const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar tus rutas (Asegúrate de que la ruta relativa sea correcta)
const authRoutes = require('./routes/authRoutes'); 

const app = express();

// --- 1. Middlewares Globales ---
app.use(helmet()); // Seguridad HTTP
app.use(cors());   // Permitir peticiones del Frontend
app.use(express.json()); // Entender JSON

// --- 2. Rutas del API ---
app.use('/api/auth', authRoutes); // Conecta /register y /login aquí

// --- 3. Health Check (Opcional) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', msg: 'API Tag Human funcionando 🚀' });
});

// Exportamos la app configurada (para que index.js la pueda encender)
module.exports = app;
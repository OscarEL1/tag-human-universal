// Importamos express para manejar las rutas
const express = require('express');
const router = express.Router();

// Importamos la función lógica que creamos en el controlador
const { registrarLog } = require('../controllers/auditoriaController');

// Opcional: Importamos el middleware de autenticación
// const { authMiddleware } = require('../middlewares/authMiddleware');

// 1. Definimos la ruta POST para registrar un nuevo acceso.
// Cuando el frontend haga una petición a /api/auditoria/registrar,
// se ejecutará la función registrarLog del controlador.
router.post('/registrar', registrarLog);

// Exportamos el router para usarlo en el archivo app.js principal
module.exports = router;
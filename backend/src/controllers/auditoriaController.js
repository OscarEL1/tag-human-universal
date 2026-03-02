const pool = require('../config/db');

const registrarLog = async (req, res) => {
    // 1. Usamos los nombres que tus compañeros ya definieron en la DB
    // En lugar de quien_entra, usaremos qr_code_data para guardar el nombre por ahora
    const { quien_entra, quien_autoriza, destino } = req.body;

    if (!quien_entra || !destino) {
        return res.status(400).json({ msg: 'Faltan campos obligatorios.' });
    }

    try {
        // 2. Ajustamos la consulta SQL a las columnas REALES de tu tabla access_logs
        const query = `
            INSERT INTO access_logs (qr_code_data, status, scanned_at)
            VALUES ($1, 'allowed', CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        
        // Guardamos el nombre del visitante en qr_code_data como prueba
        const nuevoLog = await pool.query(query, [quien_entra]);

        // 3. Simulación de notificación
        console.log(`📱 NOTIFICACIÓN: ${quien_entra} va hacia ${destino}. Autorizado por: ${quien_autoriza}`);

        res.status(201).json({
            msg: "Log de auditoría registrado exitosamente",
            data: nuevoLog.rows[0]
        });

    } catch (error) {
        console.error('Error al registrar auditoría en la BD:', error);
        res.status(500).json({ msg: 'Error interno al registrar el log' });
    }
};

module.exports = { registrarLog };
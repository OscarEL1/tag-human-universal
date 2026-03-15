const pool = require('../config/db');

const registrarLog = async (req, res) => {
    const { quien_entra, quien_autoriza, destino } = req.body;

    try {
        // 1. BUSCAR EL TELÉFONO DEL RESIDENTE SEGÚN EL DESTINO (Casa 101)
        const residentQuery = 'SELECT nombre, telefono FROM residents WHERE direccion = $1 LIMIT 1';
        const residentResult = await pool.query(residentQuery, [destino]);

        let mensajeNotificacion = `No se encontró residente para el destino: ${destino}`;
        let telefonoDestino = null;

        if (residentResult.rows.length > 0) {
            const residente = residentResult.rows[0];
            telefonoDestino = residente.telefono;
            mensajeNotificacion = `📱 NOTIFICACIÓN ENVIADA A ${residente.nombre} (${telefonoDestino}): Se ha autorizado el ingreso de ${quien_entra}.`;
        }

        // 2. GUARDAR EL LOG (Integridad de datos)
        const insertQuery = `
            INSERT INTO access_logs (qr_code_data, status, scanned_at)
            VALUES ($1, 'allowed', CURRENT_TIMESTAMP)
            RETURNING id;
        `;
        await pool.query(insertQuery, [quien_entra]);

        // 3. MOSTRAR RESULTADO EN CONSOLA
        console.log(mensajeNotificacion);

        res.status(201).json({
            msg: "Auditoría registrada",
            notificacion: mensajeNotificacion,
            telefono: telefonoDestino
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Error interno' });
    }
};

module.exports = { registrarLog };
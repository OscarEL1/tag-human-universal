const pool = require('./src/config/db'); 
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  const nombre = "Admin Tehuacán";
  const phone = "5550000001"; 
  const password = "admin123"; 
  const role = "admin";

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // SINTAXIS POSTGRESQL: ON CONFLICT
    const query = `
      INSERT INTO users (nombre, phone, password_hash, role) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (phone) 
      DO UPDATE SET role = EXCLUDED.role
    `;

    await pool.query(query, [nombre, phone, passwordHash, role]);

    console.log("🚀 Super Admin creado/actualizado correctamente en PostgreSQL");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en el seed:", err);
    process.exit(1);
  }
};

seedAdmin();
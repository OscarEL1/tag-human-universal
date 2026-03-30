/**
 * Ejecuta en orden todos los *.sql en db/migrations/.
 * Uso: node scripts/apply-migrations.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function main() {
  const dir = path.join(__dirname, '..', 'db', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8');
    await pool.query(sql);
    console.log('Aplicado:', f);
  }
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

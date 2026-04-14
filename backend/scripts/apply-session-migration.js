/**
 * Aplica la migración de user_sessions (idempotente).
 * Uso: node scripts/apply-session-migration.js
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
  const sqlPath = path.join(__dirname, '..', 'db', 'migrations', '001_user_sessions.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
  console.log('Migración user_sessions aplicada.');
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

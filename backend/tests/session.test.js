/**
 * Requiere PostgreSQL con schema base + migración user_sessions.
 * Variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET (opcional).
 */
require('dotenv').config();
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');
const app = require('../src/app');

const TEST_PHONE = '5999999999';
const TEST_PASSWORD = 'testpass123';

async function applyMigrations() {
  const dir = path.join(__dirname, '..', 'db', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8');
    await pool.query(sql);
  }
}

async function ensureTestUser() {
  const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [TEST_PHONE]);
  if (existing.rows.length > 0) return;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(TEST_PASSWORD, salt);
  await pool.query(
    `INSERT INTO users (nombre, phone, password_hash, role, plates)
     VALUES ('Test Sesión', $1, $2, 'driver', 'TST01')`,
    [TEST_PHONE, hash]
  );
}

const runSessionTests = Boolean(process.env.DB_NAME);

(runSessionTests ? describe : describe.skip)('Multisesión y tokens', () => {
  beforeAll(async () => {
    await applyMigrations();
    await ensureTestUser();
  });

  afterAll(async () => {
    await pool.query('DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE phone = $1)', [
      TEST_PHONE,
    ]);
    await pool.end();
  });
  let access1;
  let refresh1;
  let access2;
  let refresh2;

  it('login crea access + refresh', async () => {
    const res = await request(app).post('/api/auth/login').send({
      phone: TEST_PHONE,
      password: TEST_PASSWORD,
    });
    expect(res.status).toBe(200);
    expect(res.body.refreshToken).toBeTruthy();
    expect(res.body.accessToken || res.body.token).toBeTruthy();
    access1 = res.body.accessToken || res.body.token;
    refresh1 = res.body.refreshToken;
  });

  it('segundo login = segunda sesión activa', async () => {
    const res = await request(app).post('/api/auth/login').send({
      phone: TEST_PHONE,
      password: TEST_PASSWORD,
    });
    expect(res.status).toBe(200);
    access2 = res.body.accessToken || res.body.token;
    refresh2 = res.body.refreshToken;
    expect(refresh2).not.toBe(refresh1);

    const list = await request(app).get('/api/auth/sessions').set('Authorization', `Bearer ${access2}`);
    expect(list.status).toBe(200);
    const active = list.body.sessions.filter((s) => !s.revokedAt);
    expect(active.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /me valida access token y sesión en BD', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${access1}`);
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe(TEST_PHONE);
  });

  it('logout revoca solo la sesión actual', async () => {
    const res = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${access1}`);
    expect(res.status).toBe(200);

    const bad = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${access1}`);
    expect(bad.status).toBe(401);

    const still = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${access2}`);
    expect(still.status).toBe(200);
  });

  it('refresh falla si la sesión fue revocada', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken: refresh1 });
    expect(res.status).toBe(401);
  });

  it('refresh renueva access en sesión aún válida', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken: refresh2 });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${res.body.accessToken}`);
    expect(me.status).toBe(200);
  });

  it('refresh rota el token: el anterior queda inválido', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      phone: TEST_PHONE,
      password: TEST_PASSWORD,
    });
    expect(loginRes.status).toBe(200);
    const first = loginRes.body.refreshToken;
    const r1 = await request(app).post('/api/auth/refresh').send({ refreshToken: first });
    expect(r1.status).toBe(200);
    expect(r1.body.refreshToken).toBeTruthy();
    expect(r1.body.refreshToken).not.toBe(first);

    const replay = await request(app).post('/api/auth/refresh').send({ refreshToken: first });
    expect(replay.status).toBe(401);

    const r2 = await request(app).post('/api/auth/refresh').send({ refreshToken: r1.body.refreshToken });
    expect(r2.status).toBe(200);
  });

  describe('Recuperación de contraseña', () => {
    const REC_PHONE = '5888888888';

    beforeAll(async () => {
      await pool.query('DELETE FROM password_resets WHERE phone = $1', [REC_PHONE]);
      await pool.query(
        'DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE phone = $1)',
        [REC_PHONE]
      );
      await pool.query('DELETE FROM users WHERE phone = $1', [REC_PHONE]);
      const salt = await bcrypt.genSalt(10);
      const h = await bcrypt.hash('oldpass123', salt);
      await pool.query(
        `INSERT INTO users (nombre, phone, password_hash, role, plates)
         VALUES ('Recupera Test',$1,$2,'driver','RST01')`,
        [REC_PHONE, h]
      );
    });

    afterAll(async () => {
      await pool.query('DELETE FROM password_resets WHERE phone = $1', [REC_PHONE]);
      await pool.query(
        'DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE phone = $1)',
        [REC_PHONE]
      );
      await pool.query('DELETE FROM users WHERE phone = $1', [REC_PHONE]);
    });

    it('POST /recover responde igual aunque el teléfono no exista', async () => {
      const a = await request(app).post('/api/auth/recover').send({ phone: '5000000000' });
      const b = await request(app).post('/api/auth/recover').send({ phone: REC_PHONE });
      expect(a.status).toBe(200);
      expect(b.status).toBe(200);
      expect(a.body.msg).toBe(b.body.msg);
    });

    it('POST /reset-password actualiza contraseña e invalida token', async () => {
      const plain = `${'a'.repeat(60)}zz`;
      const tokenHash = crypto.createHash('sha256').update(plain, 'utf8').digest('hex');
      await pool.query(
        `INSERT INTO password_resets (phone, token_hash, expires_at, used)
         VALUES ($1, $2, NOW() + interval '1 hour', FALSE)`,
        [REC_PHONE, tokenHash]
      );

      const res = await request(app).post('/api/auth/reset-password').send({
        phone: REC_PHONE,
        token: plain,
        password: 'newpass99',
      });
      expect(res.status).toBe(200);

      const loginOk = await request(app).post('/api/auth/login').send({
        phone: REC_PHONE,
        password: 'newpass99',
      });
      expect(loginOk.status).toBe(200);

      const replay = await request(app).post('/api/auth/reset-password').send({
        phone: REC_PHONE,
        token: plain,
        password: 'another1',
      });
      expect(replay.status).toBe(400);
    });
  });
});

if (!runSessionTests) {
  // eslint-disable-next-line no-console
  console.info('[session.test] Omitido: define DB_NAME (y DB_*) en .env para ejecutar tests de integración.');
}

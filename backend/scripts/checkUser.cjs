const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
    });

(async () => {
  try {
    const email = process.argv[2] || 'trainer@example.com';
    const res = await pool.query('SELECT id, email, name, role FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      console.log('NOT_FOUND');
      process.exit(0);
    }
    console.log('FOUND', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('ERROR', err.message || err);
    process.exit(2);
  } finally {
    try { await pool.end(); } catch (e) {}
  }
})();

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
      }
);

(async () => {
  try {
    const email = process.argv[2] || process.env.DEFAULT_ADMIN_EMAIL || 'trainer@example.com';
    const password = process.argv[3] || process.env.DEFAULT_ADMIN_PASSWORD || 'Password123!';
    
    console.log(`🔄 Resetando senha...\n`);
    console.log(`📧 Usuário: ${email}`);
    console.log(`🔐 Nova senha: ${password}\n`);

    // Hash the password
    const hash = await bcrypt.hash(password, 10);
    
    // Update user password
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email, name, role',
      [hash, email]
    );

    if (result.rows.length === 0) {
      console.log(`❌ Usuário não encontrado: ${email}`);
      console.log(`\nCrie o usuário primeiro com:\n`);
      console.log(`INSERT INTO users (email, password, name, role) VALUES ('${email}', '${hash}', 'Admin', 'trainer');`);
    } else {
      console.log(`✅ Senha resetada com sucesso!\n`);
      console.log(`Usuário: ${result.rows[0].email}`);
      console.log(`Nome: ${result.rows[0].name}`);
      console.log(`Função: ${result.rows[0].role}`);
      console.log(`\nTente fazer login com essas credenciais.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ ERRO:', err.message || err);
    process.exit(1);
  } finally {
    try { await pool.end(); } catch {}
  }
})();

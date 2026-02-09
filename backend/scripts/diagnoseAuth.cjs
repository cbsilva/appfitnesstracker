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
    console.log('🔍 Verificando autenticação...\n');
    
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'trainer@example.com';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'Password123!';
    
    console.log(`📧 Email procurado: ${email}`);
    console.log(`🔐 Senha esperada: ${password}`);
    console.log(`\n---\n`);

    // Check user exists
    const res = await pool.query('SELECT id, email, name, role, password FROM users WHERE email = $1', [email]);
    
    if (res.rows.length === 0) {
      console.log('❌ Usuário NÃO encontrado no banco de dados!');
      console.log(`\nExecute no seu banco:\n`);
      console.log(`INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4);`);
      process.exit(1);
    }

    const user = res.rows[0];
    console.log(`✅ Usuário encontrado!\n`);
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Nome: ${user.name}`);
    console.log(`Função: ${user.role}`);
    console.log(`Hash no DB: ${user.password.substring(0, 20)}...`);
    console.log(`\n---\n`);

    // Test password comparison
    console.log(`🧪 Testando comparação de senha...\n`);
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log(`✅ SUCESSO! A senha está correta e hashada corretamente.`);
      console.log(`\nPossível causa do erro: Verifique se há middleware ou CORS bloqueando a requisição.`);
    } else {
      console.log(`❌ A senha NO BANCO não corresponde à senha esperada!`);
      console.log(`\nGerando novo hash para resetar...\n`);
      
      const newHash = await bcrypt.hash(password, 10);
      console.log(`Novo hash:\n${newHash}\n`);
      console.log(`Execute no seu banco:\n`);
      console.log(`UPDATE users SET password = '${newHash}' WHERE email = '${email}';`);
      console.log(`\nOu use o script: node genHash.cjs "${password}"`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ ERRO:', err.message || err);
    process.exit(2);
  } finally {
    try { await pool.end(); } catch {}
  }
})();

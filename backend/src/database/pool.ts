import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Suporta dois métodos de conexão:
// 1. CONNECTION_STRING (para Supabase ou PostgreSQL remoto)
// 2. Componentes separados (DB_USER, DB_PASSWORD, DB_HOST, etc)

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Necessário para Supabase
      },
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'fitness_tracker',
    });

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;

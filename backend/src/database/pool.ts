import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
       ssl: { rejectUnauthorized: false }       


       //family: 4, // 🔥 força IPv4
       
      //forcando o uso de IPv4 para evitar problemas de conexão em ambientes onde IPv6 pode causar erros, especialmente em produção      
       // ssl: isProduction
      //   ? { rejectUnauthorized: false }
      //   : false,
    } as any)
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'fitness_tracker',
    });

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
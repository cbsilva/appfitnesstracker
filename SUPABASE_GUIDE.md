# Como Usar Supabase com Fitness Tracker

## O que é Supabase?

Supabase é uma plataforma que oferece um PostgreSQL gerenciado na nuvem, perfeito para projetos sem ter que instalar banco de dados localmente.

---

## 🚀 Passo a Passo: Configurar com Supabase

### 1. Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou email
4. Crie uma nova organização

### 2. Criar um Novo Projeto

1. Clique em "New Project"
2. Preencha:
   - **Project Name**: `fitness-tracker`
   - **Database Password**: Crie uma senha forte (guarde bem!)
   - **Region**: Escolha a mais próxima de você (ex: `São Paulo`)
3. Clique em "Create new project"
4. Aguarde 2-3 minutos pela criação

### 3. Acessar o SQL Editor

1. No painel do Supabase, clique em **SQL Editor** (à esquerda)
2. Clique em **New Query**
3. Cole o conteúdo do arquivo `database/schema.sql`
4. Clique em **Run**

✅ Suas tabelas foram criadas!

### 4. Copiar String de Conexão

1. No Supabase, clique em **Settings** (engrenagem)
2. Vá para **Database**
3. Role para baixo até encontrar **Connection pooling** ou **Connection string**
4. Copie a URL (algo como: `postgresql://user:password@host:5432/postgres`)

### 5. Configurar seu Projeto

Edite `backend/.env`:

```env
# Supabase Connection String
DB_USER=postgres
DB_PASSWORD=sua_senha_supabase
DB_HOST=seu_host_supabase.supabase.co
DB_PORT=5432
DB_NAME=postgres

NODE_ENV=development
PORT=3001
JWT_SECRET=sua_chave_secreta_aqui
```

Ou use a **Connection String** completa modificando `backend/src/database/pool.ts`:

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default pool;
```

E no `.env`:

```env
DATABASE_URL=postgresql://user:password@host.supabase.co:5432/postgres
JWT_SECRET=sua_chave_secreta
```

### 6. Desabilitar Inicialização Automática

Como as tabelas já existem no Supabase, você pode comentar a inicialização automática em `backend/src/server.ts`:

```typescript
// Remova ou comente esta linha
// initializeDatabase().catch(err => {
//   console.error('Failed to initialize database:', err);
//   process.exit(1);
// });
```

Ou modifique `backend/src/database/init.ts` para verificar se as tabelas já existem:

```typescript
export async function initializeDatabase() {
  try {
    // Verificar se tabela já existe
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('Database tables already exist');
      return;
    }
    
    // ... resto do código de criação ...
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}
```

### 7. Instalar Dependências e Iniciar

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

---

## 📋 Arquivo SQL Disponível

O script SQL está em: **`database/schema.sql`**

Este arquivo contém:
- ✅ 6 tabelas (users, students, training_plans, workouts, exercises, progress_logs)
- ✅ Relacionamentos (foreign keys)
- ✅ Constraints e validações
- ✅ Índices para performance

---

## 🔑 Como Obter Credenciais do Supabase

### Método 1: Usar Connection String Completa (Recomendado)

1. No Supabase → Settings → Database → Connection String
2. Copie a URI PostgreSQL
3. Cole em `backend/.env` como `DATABASE_URL`

### Método 2: Usar Componentes Separados

1. No Supabase → Settings → Database
   - **Host**: Copie o endereço do servidor
   - **Port**: Geralmente `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: A senha que você criou

2. Cole em `backend/.env`:
```env
DB_HOST=sua_url.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua_senha
```

---

## ✅ Verificar Conexão

Após configurar, teste a conexão:

```bash
# No terminal
psql postgresql://user:password@host.supabase.co:5432/postgres

# Dentro do psql
\dt  # Listar todas as tabelas
```

Se aparecerem as 6 tabelas, está conectado! ✅

---

## 🚀 Próximos Passos

1. ✅ Criar conta no Supabase
2. ✅ Executar o script SQL (`database/schema.sql`)
3. ✅ Configurar `backend/.env` com as credenciais
4. ✅ Iniciar backend e frontend
5. ✅ Testar em http://localhost:3000

---

## 💡 Dicas Úteis

### 1. Não Compartilhe Suas Credenciais
- Nunca faça commit do `.env` no Git
- Use `.env.example` como modelo

### 2. Fazer Backup
- No Supabase → Backups, você pode fazer backup automático

### 3. Monitorar Uso
- Supabase oferece plano gratuito com limites
- Verifique em https://supabase.com/pricing

### 4. Acessar via SQL Editor
- Use o SQL Editor do Supabase para queries diretas
- Perfeito para debug

### 5. Testar Localmente Primeiro
- Se possível, teste com PostgreSQL local antes
- Assim você evita usar créditos do Supabase

---

## 🔐 Segurança

- ✅ Nunca compartilhe sua connection string
- ✅ Use senhas fortes
- ✅ Configure `.env` no `.gitignore`
- ✅ Considere usar variables de ambiente secretas em produção

---

## ❓ Troubleshooting

### Erro: "Connection refused"
- Verifique se o IP está na whitelist do Supabase
- Settings → Database → Restrict connections with SSL

### Erro: "Password authentication failed"
- Verifique a senha no `.env`
- Copie exatamente como está no Supabase

### Erro: "Database does not exist"
- O database padrão é `postgres`
- Não crie um novo, use o padrão

### Erro: "Connect timeout"
- Pode ser problema de rede
- Tente usar um VPN ou espere alguns minutos

---

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Connection String Format](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

---

**Pronto para usar!** 🚀

Se tiver dúvidas, consulte:
1. Este arquivo
2. `DEVELOPMENT_GUIDE.md`
3. Documentação do Supabase

---

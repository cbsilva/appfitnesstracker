🚀 **QUICK START GUIDE - FITNESS TRACKER**

## ⚡ Início Rápido em 5 Minutos

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+

### Passo 1: Setup Automático (1 minuto)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh && ./setup.sh
```

---

### Passo 2: Configurar Banco de Dados (1 minuto)

#### Abra um terminal e execute:

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Dentro do psql, execute:
CREATE DATABASE fitness_tracker;
\q
```

#### Edite o arquivo `backend/.env`:
```
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitness_tracker
JWT_SECRET=sua_chave_super_secreta_aqui_123
```

---

### Passo 3: Iniciar Backend (1 minuto)

```bash
cd backend
npm run dev
```

Esperado:
```
Server running on port 3001
Database initialized successfully
```

---

### Passo 4: Iniciar Frontend (1 minuto)

**Em um novo terminal:**

```bash
cd frontend
npm run dev
```

Esperado:
```
Local:   http://localhost:3000/
```

---

### Passo 5: Testar a Aplicação (1 minuto)

1. Abra http://localhost:3000 no navegador
2. Clique em "Registrar"
3. Preencha os dados:
   - Email: `trainer@example.com`
   - Senha: `senha123`
   - Nome: `João Trainer`
   - Tipo: **Trainer**
4. Clique em "Registrar"
5. Você será redirecionado para o Dashboard

---

## ✅ Seu app está rodando!

| Serviço | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✅ |
| Backend API | http://localhost:3001/api | ✅ |
| Health Check | http://localhost:3001/api/health | ✅ |
| Banco de Dados | fitness_tracker | ✅ |

---

## 🎯 O que Fazer Agora?

### Opção 1: Explorar a Interface
1. Crie conta como **Trainer**
2. Registre-se novamente como **Student**
3. Como trainer, adicione o aluno
4. Crie um plano de treino
5. Adicione exercícios

### Opção 2: Testar com API REST Client
Instale a extensão "REST Client" no VS Code e crie um arquivo `requests.http`:

```http
### Login
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "trainer@example.com",
  "password": "senha123"
}

### Health Check
GET http://localhost:3001/api/health
```

Clique em "Send Request" para testar.

### Opção 3: Ler a Documentação
- **README.md** - Visão geral
- **API_DOCUMENTATION.md** - Todos os endpoints
- **USAGE_EXAMPLE.md** - Exemplos práticos
- **DEVELOPMENT_GUIDE.md** - Guia técnico

---

## 🛠️ Troubleshooting Rápido

### Erro: "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -c "SELECT 1;"

# Criar banco se não existir
psql -U postgres -c "CREATE DATABASE fitness_tracker;"
```

### Erro: "npm: command not found"
- Instale Node.js: https://nodejs.org/
- Reinicie o terminal

---

## 📊 Estrutura Básica

```
AppPersonal/
├── frontend/          # React app
├── backend/           # Express API
├── README.md
├── setup.bat
└── setup.sh
```

---

## 🔑 Comandos Úteis

```bash
# Iniciar backend
cd backend && npm run dev

# Iniciar frontend
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Instalar dependências
npm install

# Acessar banco de dados
psql -U postgres -d fitness_tracker
```

---

## 🎮 Testar Endpoints Principais

### 1. Register (POST)
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"trainer@example.com","password":"senha123","name":"João","role":"trainer"}'
```

### 2. Login (POST)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"trainer@example.com","password":"senha123"}'
```

### 3. Health Check (GET)
```bash
curl http://localhost:3001/api/health
```

---

## 📚 Documentação Completa

Leia os arquivos na raiz do projeto:

- **README.md** - Guia geral ⭐
- **DEVELOPMENT_GUIDE.md** - Como desenvolver ⭐
- **API_DOCUMENTATION.md** - Referência de API ⭐
- **USAGE_EXAMPLE.md** - Exemplos práticos
- **PROJECT_STATUS.md** - Status do projeto

---

## 🎉 Parabéns!

Você tem um aplicativo fullstack completamente funcional para gerenciar treinos!

Próximos passos:
1. Explorar a interface
2. Testar os endpoints
3. Ler a documentação
4. Começar a desenvolver novas features

---

**Dúvidas?** Consulte a documentação ou os arquivos .md na raiz do projeto.

**Última atualização:** 28 de Janeiro de 2026

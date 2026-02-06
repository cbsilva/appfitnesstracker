# Guia de Desenvolvimento - Fitness Tracker

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Setup Inicial](#setup-inicial)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Iniciando o Desenvolvimento](#iniciando-o-desenvolvimento)
6. [Banco de Dados](#banco-de-dados)
7. [Fluxo de Trabalho](#fluxo-de-trabalho)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior)
  - Download: https://nodejs.org/
  - Verificar: `node --version`

- **npm** (geralmente instalado com Node.js)
  - Verificar: `npm --version`

- **PostgreSQL** (v12 ou superior)
  - Download: https://www.postgresql.org/download/
  - Verificar: `psql --version`

- **Visual Studio Code** (recomendado)
  - Download: https://code.visualstudio.com/

### Extensões VS Code Recomendadas
- **REST Client** - Para testar APIs
- **PostgreSQL** - Para gerenciar banco de dados
- **ES7+ React/Redux/React-Native snippets**
- **Thunder Client** - Alternativa ao REST Client
- **Prettier** - Para formatar código

---

## 🚀 Setup Inicial

### 1. Clonar/Preparar o Projeto
```bash
# Entrar no diretório do projeto
cd AppPersonal
```

### 2. Instalar Dependências (Windows)
```bash
# Execute o script de setup
setup.bat
```

### 3. Instalar Dependências (Linux/Mac)
```bash
# Dê permissão de execução
chmod +x setup.sh

# Execute o script
./setup.sh
```

### 4. Setup Manual (se preferir)
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 📁 Estrutura do Projeto

```
AppPersonal/
│
├── frontend/                    # Aplicação React
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── pages/              # Páginas principais (Login, Dashboard, etc)
│   │   ├── services/           # Serviços de API (authService, trainingService, etc)
│   │   ├── styles/             # Arquivos CSS
│   │   ├── App.tsx             # Componente principal
│   │   └── main.tsx            # Entrada da aplicação
│   ├── index.html              # HTML principal
│   ├── package.json            # Dependências
│   ├── tsconfig.json           # Config TypeScript
│   ├── vite.config.ts          # Config do Vite
│   └── .env.example            # Variáveis de ambiente exemplo
│
├── backend/                     # API Express
│   ├── src/
│   │   ├── routes/             # Rotas da API (auth, students, trainingPlans, etc)
│   │   ├── controllers/        # Lógica de negócio (será expandido)
│   │   ├── models/             # Modelos de dados (será expandido)
│   │   ├── middleware/         # Middlewares (auth, validação, etc)
│   │   ├── database/           # Pool de conexão e inicialização
│   │   └── server.ts           # Arquivo principal do servidor
│   ├── package.json            # Dependências
│   ├── tsconfig.json           # Config TypeScript
│   └── .env.example            # Variáveis de ambiente exemplo
│
├── .github/
│   └── copilot-instructions.md # Instruções customizadas
│
├── .gitignore                  # Arquivos ignorados pelo Git
├── README.md                   # Documentação do projeto
├── API_DOCUMENTATION.md        # Documentação da API
├── DEVELOPMENT_GUIDE.md        # Este arquivo
├── setup.sh                    # Script de setup (Linux/Mac)
└── setup.bat                   # Script de setup (Windows)
```

---

## 🔑 Variáveis de Ambiente

### Backend (.env)

Copie o arquivo `.env.example` para `.env` no diretório `backend`:

```bash
# Database
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitness_tracker

# Server
NODE_ENV=development
PORT=3001

# JWT
JWT_SECRET=sua_chave_secreta_muito_forte_aqui
```

### Frontend (.env)

Copie o arquivo `.env.example` para `.env` no diretório `frontend`:

```bash
VITE_API_URL=http://localhost:3001/api
```

---

## 🏃 Iniciando o Desenvolvimento

### Passo 1: Criar Banco de Dados PostgreSQL

**Windows (PowerShell):**
```powershell
# Conectar ao PostgreSQL
psql -U postgres

# Dentro do psql:
CREATE DATABASE fitness_tracker;
\l  # Listar bancos
\q  # Sair
```

**Linux/Mac:**
```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# Dentro do psql:
CREATE DATABASE fitness_tracker;
\l  # Listar bancos
\q  # Sair
```

### Passo 2: Iniciar o Backend

```bash
cd backend
npm run dev
```

Você verá:
```
Server running on port 3001
```

O backend:
- Criará automaticamente as tabelas no banco de dados
- Estará disponível em `http://localhost:3001`
- API estará em `http://localhost:3001/api`

### Passo 3: Iniciar o Frontend (novo terminal)

```bash
cd frontend
npm run dev
```

Você verá:
```
Local:   http://localhost:3000/
```

Acesse http://localhost:3000 no seu navegador.

---

## 🗄️ Banco de Dados

### Tabelas Criadas Automaticamente

Quando o backend inicia, as seguintes tabelas são criadas:

#### 1. **users**
Armazena usuários (trainers e students)
```sql
id | email | password | name | role | created_at | updated_at
```

#### 2. **students**
Perfil de alunos com informações pessoais
```sql
id | user_id | trainer_id | age | weight | height | gender | modality | medical_restrictions
```

#### 3. **training_plans**
Planos de treino customizados
```sql
id | student_id | trainer_id | title | description | start_date | end_date | modality | frequency | status
```

#### 4. **workouts**
Treinos dentro de um plano
```sql
id | training_plan_id | day_of_week | name | description | duration_minutes | difficulty
```

#### 5. **exercises**
Exercícios dentro de um treino
```sql
id | workout_id | name | series | repetitions | weight | duration_seconds | rest_seconds | notes | exercise_order
```

#### 6. **progress_logs**
Registros de progresso e conclusão
```sql
id | student_id | workout_date | workout_id | notes | completed
```

### Conectar ao Banco de Dados

```bash
# Windows/Linux/Mac
psql -U postgres -d fitness_tracker

# Ver tabelas
\dt

# Ver estrutura de uma tabela
\d students

# Sair
\q
```

---

## 💻 Fluxo de Trabalho

### Desenvolvimento de Nova Funcionalidade

#### 1. Criar Rota no Backend
```typescript
// backend/src/routes/novaRota.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  // Lógica aqui
});

export default router;
```

#### 2. Adicionar Rota ao Server
```typescript
// backend/src/server.ts
import novaRotaRoutes from './routes/novaRota';

app.use('/api/nova-rota', novaRotaRoutes);
```

#### 3. Criar Serviço no Frontend
```typescript
// frontend/src/services/novaService.ts
import api from './api';

export const novaService = {
  getItems: async () => {
    const response = await api.get('/nova-rota');
    return response.data;
  },
};
```

#### 4. Criar Componente React
```typescript
// frontend/src/pages/NovaPage.tsx
import React, { useState, useEffect } from 'react';
import { novaService } from '../services/novaService';

export default function NovaPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    novaService.getItems().then(setItems);
  }, []);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### 5. Adicionar Rota no App
```typescript
// frontend/src/App.tsx
import NovaPage from './pages/NovaPage';

<Route path="/nova" element={<NovaPage />} />
```

---

## 🧪 Testando a API

### Usando REST Client (VS Code)

1. Instale a extensão "REST Client"
2. Crie um arquivo `requests.http`

```http
### Login
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "trainer@example.com",
  "password": "password123"
}

### Criar Aluno
POST http://localhost:3001/api/students
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "user_id": 2,
  "age": 25,
  "weight": 85.5,
  "height": 1.80,
  "gender": "M",
  "modality": "musculacao"
}
```

3. Clique em "Send Request" para testar

### Usando cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"trainer@example.com","password":"password123"}'

# Listar alunos (com token)
curl -X GET http://localhost:3001/api/students \
  -H "Authorization: Bearer <seu_token>"
```

---

## 📝 Convenções de Código

### TypeScript
- Use tipos explícitos sempre que possível
- Defina interfaces para objetos
- Evite `any` type

### React
- Componentes funcionais com Hooks
- Props bem tipados com TypeScript
- Imports organizados

### Banco de Dados
- Nomes de tabelas em plural em inglês
- Colunas em snake_case
- Sempre use IDs para chave primária

### Commits
```bash
git commit -m "feat: adicionar novo componente X"
git commit -m "fix: corrigir bug em Y"
git commit -m "docs: atualizar documentação"
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express'"
```bash
cd backend
npm install
```

### Erro: "Port 3001 already in use"
```bash
# Linux/Mac: Matar processo na porta
lsof -ti:3001 | xargs kill -9

# Windows: Encontrar e matar processo
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Erro: "Cannot connect to database"
1. Verifique se PostgreSQL está rodando
2. Verifique credenciais em `.env`
3. Verifique se o banco `fitness_tracker` foi criado

```bash
psql -U postgres -d fitness_tracker -c "SELECT 1;"
```

### CORS Error
- Verifique se backend está configurado com CORS
- Verifique se a URL no proxy do frontend está correta

---

## 📚 Recursos Adicionais

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [TypeScript Docs](https://www.typescriptlang.org)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [JWT Intro](https://jwt.io/introduction)

---

**Última atualização:** 28 de Janeiro de 2026

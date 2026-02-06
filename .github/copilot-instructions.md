<!-- Use this file to provide workspace-specific custom instructions to Copilot. -->

## Projeto: Fitness Tracker - Aplicativo de Controle de Treinos

### Descrição
Aplicativo fullstack para gerenciamento completo de treinos de musculação e corrida. Permite que personal trainers e educadores físicos gerenciem planos de treino, acompanhem alunos presenciais e remotos, registrem progresso e façam análise de desempenho.

### Requisitos Completados
✅ Estrutura fullstack com Frontend (React + TypeScript) e Backend (Node.js + Express)
✅ Banco de dados PostgreSQL com schema completo para gerenciamento de treinos
✅ Autenticação com JWT (Login e Registro)
✅ Componentes principais do frontend (Login, Dashboard, Training Plans, Student Tracking)
✅ Serviços de API com Axios para comunicação
✅ Estilos CSS responsivos e modernos
✅ Middleware de autenticação e autorização
✅ Rotas CRUD completas para: Auth, Students, Training Plans, Workouts, Exercises, Progress
✅ Documentação completa da API
✅ Guia de desenvolvimento

### Stack Tecnológico

**Frontend:**
- React 18 com TypeScript
- Vite para build e dev
- React Router v6 para navegação
- Axios para requisições HTTP
- CSS3 responsivo

**Backend:**
- Node.js com Express
- TypeScript
- PostgreSQL para banco de dados
- JWT para autenticação
- Bcrypt para hash de senhas
- CORS habilitado

### Estrutura do Projeto
```
AppPersonal/
├── frontend/                    # Aplicação React + Vite
│   ├── src/
│   │   ├── pages/             # Login, Dashboard, TrainingPlan, StudentTracking
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── services/          # authService, trainingService
│   │   └── styles/            # CSS modular
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # API Express
│   ├── src/
│   │   ├── routes/            # Auth, Students, TrainingPlans, Workouts, Exercises, Progress
│   │   ├── middleware/        # Auth middleware
│   │   └── database/          # Pool e inicialização
│   └── package.json
│
├── README.md                   # Documentação principal
├── API_DOCUMENTATION.md        # Documentação da API REST
├── DEVELOPMENT_GUIDE.md        # Guia de desenvolvimento
├── setup.sh                    # Script setup (Linux/Mac)
└── setup.bat                   # Script setup (Windows)
```

### Próximos Passos para Desenvolvimento

1. **Instalar Dependências**
   ```bash
   # Windows
   setup.bat
   
   # Linux/Mac
   chmod +x setup.sh && ./setup.sh
   ```

2. **Configurar Banco de Dados**
   - Editar `backend/.env` com credenciais PostgreSQL
   - Criar banco: `CREATE DATABASE fitness_tracker;`

3. **Iniciar Desenvolvimento**
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

4. **Acessar Aplicação**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001/api

### Endpoints da API Disponíveis

**Autenticação:**
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário

**Alunos:**
- `POST /students` - Criar aluno
- `GET /students` - Listar alunos
- `GET /students/:id` - Obter aluno
- `PUT /students/:id` - Atualizar aluno
- `DELETE /students/:id` - Deletar aluno

**Planos de Treino:**
- `POST /training-plans` - Criar plano
- `GET /training-plans` - Listar planos
- `GET /training-plans/:id` - Obter plano
- `PUT /training-plans/:id` - Atualizar plano
- `DELETE /training-plans/:id` - Deletar plano

**Treinos:**
- `POST /workouts` - Criar treino
- `GET /workouts/plan/:planId` - Listar treinos do plano
- `PUT /workouts/:id` - Atualizar treino
- `DELETE /workouts/:id` - Deletar treino

**Exercícios:**
- `POST /exercises` - Criar exercício
- `GET /exercises/workout/:workoutId` - Listar exercícios do treino
- `PUT /exercises/:id` - Atualizar exercício
- `DELETE /exercises/:id` - Deletar exercício

**Progresso:**
- `POST /progress` - Registrar progresso
- `GET /progress/student/:studentId` - Listar progresso do aluno
- `PUT /progress/:id` - Atualizar progresso
- `DELETE /progress/:id` - Deletar progresso

### Funcionalidades Implementadas

#### For Personal Trainers
✅ Autenticação segura
✅ Gerenciar alunos (CRUD)
✅ Criar planos de treino customizados
✅ Adicionar exercícios aos planos
✅ Acompanhar progresso dos alunos
✅ Editar planos em tempo real
✅ Visualizar dashboard com todos os alunos

#### For Students
✅ Autenticação segura
✅ Visualizar plano de treino pessoal
✅ Marcar exercícios como completos
✅ Registrar progresso
✅ Visualizar histórico de treinos

### Funcionalidades Futuras

- [ ] Integração com câmera para gravação de exercícios
- [ ] Notificações em tempo real
- [ ] Relatórios detalhados com gráficos
- [ ] Integração com wearables e smartwatches
- [ ] App mobile nativo (React Native)
- [ ] Dashboard avançado com analytics
- [ ] Chat em tempo real entre trainer e aluno
- [ ] Sistema de pagamento integrado
- [ ] Backup automático de dados
- [ ] App offline-first

### Padrões de Código Utilizados

**Backend:**
- MVC (Model-View-Controller) - Rotas como controllers
- Middleware pattern para autenticação
- Prepared statements para segurança SQL
- Tratamento centralizado de erros

**Frontend:**
- Component-based architecture
- Custom Hooks para lógica reutilizável
- Service layer para API communication
- Context API para state management (futuro)

### Segurança

- ✅ JWT tokens com expiração de 24h
- ✅ Senhas hasheadas com bcrypt
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Middleware de autenticação em rotas privadas
- ✅ Prepared statements contra SQL injection

### Documentação

Consulte os seguintes arquivos para mais informações:

- **[README.md](../README.md)** - Visão geral e setup
- **[API_DOCUMENTATION.md](../API_DOCUMENTATION.md)** - Referência completa da API
- **[DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md)** - Guia de desenvolvimento e troubleshooting

### Próxima Ação Recomendada

1. Executar `setup.bat` (Windows) ou `setup.sh` (Linux/Mac)
2. Configurar PostgreSQL em `backend/.env`
3. Iniciar backend: `npm run dev` em `backend/`
4. Iniciar frontend: `npm run dev` em `frontend/`
5. Testar em http://localhost:3000


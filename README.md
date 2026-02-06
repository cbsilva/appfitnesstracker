# Fitness Tracker - Aplicativo de Controle de Treinos

Um aplicativo web completo para gerenciamento de treinos de musculação e corrida, permitindo que personal trainers e educadores físicos gerenciem planos de treino para alunos presenciais e remotos.

## 🎯 Características

- **Autenticação de Usuários**: Login seguro com JWT
- **Gerenciamento de Alunos**: Cadastro e acompanhamento de alunos
- **Planos de Treino**: Criação e customização de planos
- **Modalidades**: Suporte para musculação, corrida e ambos
- **Acompanhamento de Progresso**: Rastreamento de exercícios e progresso
- **Interface Responsiva**: Funciona em desktop, tablet e mobile
- **Suporte Remoto e Presencial**: Acompanhamento para ambas as modalidades

## 🏗️ Arquitetura

### Frontend
- **React 18** com TypeScript
- **Vite** para build e development
- **React Router** para navegação
- **Axios** para requisições HTTP
- **CSS Modular** para estilos

### Backend
- **Node.js** com Express
- **TypeScript**
- **PostgreSQL** para persistência de dados
- **JWT** para autenticação
- **Bcrypt** para hash de senhas

## 📁 Estrutura do Projeto

```
AppPersonal/
├── frontend/
│   ├── src/
│   │   ├── pages/           # Páginas principais
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── services/        # Serviços de API
│   │   └── styles/          # Estilos CSS
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/          # Rotas da API
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── models/          # Modelos de dados
│   │   ├── middleware/      # Middlewares
│   │   ├── database/        # Configuração do DB
│   │   └── server.ts        # Servidor principal
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚀 Como Começar

### Requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
cd AppPersonal
```

2. **Instale as dependências do backend**
```bash
cd backend
npm install
```

3. **Configure o banco de dados**
```bash
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL
```

4. **Instale as dependências do frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
```

### Desenvolvimento

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
# Servidor rodará em http://localhost:3001
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
# Aplicação rodará em http://localhost:3000
```

## 📊 Banco de Dados

### Tabelas Principais

- **users**: Usuários (trainer/student)
- **students**: Perfil de alunos com referência ao trainer
- **training_plans**: Planos de treino customizados
- **workouts**: Treinos (dias da semana)
- **exercises**: Exercícios individual com séries, repetições, etc
- **progress_logs**: Registro de progresso e conclusão de treinos

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação. O token é armazenado no localStorage e enviado em cada requisição via header `Authorization: Bearer <token>`.

## 📱 Funcionalidades Principais

### Para Trainers
- Cadastrar e gerenciar alunos
- Criar planos de treino customizados
- Adicionar exercícios aos planos
- Acompanhar progresso dos alunos
- Editar planos em tempo real

### Para Alunos
- Visualizar plano de treino pessoal
- Marcar exercícios como completos
- Acompanhar seu progresso
- Visualizar histórico de treinos

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- React Router v6
- Axios
- CSS3

### Backend
- Express.js
- TypeScript
- PostgreSQL
- JWT
- Bcrypt

## 📝 Variáveis de Ambiente

### Backend (.env)
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitness_tracker
NODE_ENV=development
PORT=3001
JWT_SECRET=your_secret_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

## 🚧 Roadmap

- [ ] Integração com câmera para gravação de exercícios
- [ ] Notificações em tempo real
- [ ] Relatórios detalhados de progresso
- [ ] Integração com wearables
- [ ] App mobile nativo
- [ ] Dashboard avançado com gráficos
- [ ] Sistema de mensagens entre trainer e aluno
- [ ] Integração com plataformas de pagamento

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido como aplicação para gerenciamento de treinos de musculação e corrida.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

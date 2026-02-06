# Documentação da API - Fitness Tracker

## Base URL
```
http://localhost:3001/api
```

## Autenticação
Todas as rotas (exceto login/register) requerem um JWT token no header:
```
Authorization: Bearer <token>
```

---

## 🔐 Autenticação

### POST /auth/login
Login de usuário

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "João Silva",
    "role": "trainer"
  }
}
```

### POST /auth/register
Registrar novo usuário

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "João Silva",
  "role": "trainer"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "João Silva",
    "role": "trainer"
  }
}
```

---

## 👥 Alunos (Students)

### POST /students
Criar novo aluno (apenas trainers)

**Request:**
```json
{
  "user_id": 2,
  "age": 25,
  "weight": 85.5,
  "height": 1.80,
  "gender": "M",
  "modality": "musculacao",
  "medical_restrictions": "Sem restrições"
}
```

**Response (201):** Objeto do aluno criado

### GET /students
Listar alunos do trainer logado

**Response (200):** Array de alunos

### GET /students/:id
Obter detalhes de um aluno específico

**Response (200):** Objeto do aluno

### PUT /students/:id
Atualizar informações do aluno (apenas trainers)

**Request:**
```json
{
  "weight": 82,
  "medical_restrictions": "Dor no joelho"
}
```

**Response (200):** Aluno atualizado

### DELETE /students/:id
Deletar aluno (apenas trainers)

**Response (200):**
```json
{
  "message": "Aluno deletado com sucesso"
}
```

---

## 📋 Planos de Treino (Training Plans)

### POST /training-plans
Criar plano de treino (apenas trainers)

**Request:**
```json
{
  "student_id": 2,
  "title": "Hipertrofia - Março/2026",
  "description": "Plano focado em ganho de massa muscular",
  "start_date": "2026-03-01",
  "end_date": "2026-03-31",
  "modality": "musculacao",
  "frequency": 4
}
```

**Response (201):** Plano criado

### GET /training-plans
Listar planos do usuário logado

**Response (200):** Array de planos

### GET /training-plans/:id
Obter detalhes de um plano

**Response (200):** Objeto do plano

### PUT /training-plans/:id
Atualizar plano (apenas trainer proprietário)

**Request:**
```json
{
  "title": "Hipertrofia - Março/2026 (Revisado)",
  "status": "paused",
  "frequency": 3
}
```

**Response (200):** Plano atualizado

### DELETE /training-plans/:id
Deletar plano (apenas trainer proprietário)

**Response (200):**
```json
{
  "message": "Plano deletado com sucesso"
}
```

---

## 💪 Treinos (Workouts)

### POST /workouts
Criar treino dentro de um plano (apenas trainers)

**Request:**
```json
{
  "training_plan_id": 1,
  "day_of_week": 1,
  "name": "Peito e Tríceps",
  "description": "Dia focado em peito e tríceps",
  "duration_minutes": 60,
  "difficulty": "intermediario"
}
```

**Response (201):** Treino criado

### GET /workouts/plan/:planId
Listar treinos de um plano

**Response (200):** Array de treinos

### GET /workouts/:id
Obter detalhes de um treino

**Response (200):** Objeto do treino

### PUT /workouts/:id
Atualizar treino (apenas trainers)

**Request:**
```json
{
  "name": "Peito e Tríceps (Revisado)",
  "duration_minutes": 75
}
```

**Response (200):** Treino atualizado

### DELETE /workouts/:id
Deletar treino (apenas trainers)

**Response (200):**
```json
{
  "message": "Treino deletado com sucesso"
}
```

---

## 🏃 Exercícios (Exercises)

### POST /exercises
Criar exercício dentro de um treino (apenas trainers)

**Request:**
```json
{
  "workout_id": 1,
  "name": "Supino Reto",
  "series": 4,
  "repetitions": "8-10",
  "weight": 80.0,
  "duration_seconds": null,
  "rest_seconds": 90,
  "notes": "Usar barra olímpica",
  "exercise_order": 1
}
```

**Response (201):** Exercício criado

### GET /exercises/workout/:workoutId
Listar exercícios de um treino

**Response (200):** Array de exercícios

### GET /exercises/:id
Obter detalhes de um exercício

**Response (200):** Objeto do exercício

### PUT /exercises/:id
Atualizar exercício (apenas trainers)

**Request:**
```json
{
  "series": 5,
  "weight": 85.0
}
```

**Response (200):** Exercício atualizado

### DELETE /exercises/:id
Deletar exercício (apenas trainers)

**Response (200):**
```json
{
  "message": "Exercício deletado com sucesso"
}
```

---

## 📊 Progresso (Progress Logs)

### POST /progress
Registrar progresso de um treino

**Request:**
```json
{
  "student_id": 2,
  "workout_date": "2026-03-15",
  "workout_id": 1,
  "notes": "Treino foi puxado, mas consegui completar todas as séries",
  "completed": true
}
```

**Response (201):** Registro criado

### GET /progress/student/:studentId
Listar progresso de um aluno

**Response (200):** Array de registros de progresso

### GET /progress/:id
Obter detalhes de um registro

**Response (200):** Objeto do registro

### PUT /progress/:id
Atualizar registro de progresso

**Request:**
```json
{
  "notes": "Consegui aumentar o peso em 5kg",
  "completed": true
}
```

**Response (200):** Registro atualizado

### DELETE /progress/:id
Deletar registro (apenas admin)

**Response (200):**
```json
{
  "message": "Registro deletado com sucesso"
}
```

---

## 🔧 Utilidades

### GET /health
Verificar se o servidor está rodando

**Response (200):**
```json
{
  "status": "Server is running"
}
```

---

## Códigos de Status HTTP

- **200**: OK - Requisição bem-sucedida
- **201**: Created - Recurso criado com sucesso
- **400**: Bad Request - Requisição inválida
- **401**: Unauthorized - Não autenticado
- **403**: Forbidden - Não autorizado
- **404**: Not Found - Recurso não encontrado
- **500**: Internal Server Error - Erro no servidor

---

## Tipos de Erros

Todos os erros retornam um JSON com a seguinte estrutura:

```json
{
  "error": "Descrição do erro"
}
```

---

## Permissões por Role

### Trainer (Personal/Professor)
- ✅ Criar/editar/deletar alunos
- ✅ Criar/editar/deletar planos de treino
- ✅ Criar/editar/deletar treinos
- ✅ Criar/editar/deletar exercícios
- ✅ Ver progresso dos alunos

### Student (Aluno)
- ✅ Ver seus dados pessoais
- ✅ Ver seu plano de treino
- ✅ Registrar progresso
- ❌ Editar plano de treino
- ❌ Gerenciar outros alunos

---

## Exemplo de Fluxo Completo

### 1. Registrar um trainer
```bash
POST /auth/register
Body: { email, password, name: "João", role: "trainer" }
```

### 2. Registrar um aluno
```bash
POST /auth/register
Body: { email, password, name: "Maria", role: "student" }
```

### 3. Adicionar aluno ao trainer
```bash
POST /students
Body: { user_id: 2, age: 25, weight: 70, height: 1.65, ... }
```

### 4. Criar plano de treino
```bash
POST /training-plans
Body: { student_id: 1, title: "Iniciante", modality: "musculacao", ... }
```

### 5. Criar treino
```bash
POST /workouts
Body: { training_plan_id: 1, day_of_week: 1, name: "Peito", ... }
```

### 6. Adicionar exercícios
```bash
POST /exercises
Body: { workout_id: 1, name: "Supino", series: 4, ... }
```

### 7. Registrar progresso
```bash
POST /progress
Body: { student_id: 1, workout_date: "2026-03-15", completed: true }
```

---

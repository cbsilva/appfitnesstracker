# Exemplo de Uso - Fitness Tracker

Este arquivo demonstra um fluxo completo de uso da aplicação Fitness Tracker.

## Cenário: João é um Personal Trainer

João é um personal trainer que quer usar o Fitness Tracker para gerenciar seus alunos de musculação e corrida.

### 1. João cria sua conta de trainer

**Passos:**
1. Acessa http://localhost:3000
2. Clica em "Registrar"
3. Preenche:
   - Email: `joao@trainer.com`
   - Senha: `senha123`
   - Nome: `João Silva`
   - Tipo: `Trainer`
4. Clica em "Registrar"

**API Call:**
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "joao@trainer.com",
  "password": "senha123",
  "name": "João Silva",
  "role": "trainer"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "joao@trainer.com",
    "name": "João Silva",
    "role": "trainer"
  }
}
```

### 2. João cadastra seu primeiro aluno, Maria

Primeiro, Maria cria sua conta:

```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "maria@email.com",
  "password": "senha456",
  "name": "Maria Santos",
  "role": "student"
}
```

Maria recebe `user_id: 2`

Depois, João registra Maria como seu aluno:

```bash
POST http://localhost:3001/api/students
Content-Type: application/json
Authorization: Bearer {JOAO_TOKEN}

{
  "user_id": 2,
  "age": 28,
  "weight": 72.5,
  "height": 1.68,
  "gender": "F",
  "modality": "musculacao",
  "medical_restrictions": "Sem restrições"
}
```

**Resposta:**
```json
{
  "id": 1,
  "user_id": 2,
  "trainer_id": 1,
  "age": 28,
  "weight": 72.5,
  "height": 1.68,
  "gender": "F",
  "modality": "musculacao",
  "medical_restrictions": "Sem restrições",
  "created_at": "2026-01-28T10:00:00Z",
  "updated_at": "2026-01-28T10:00:00Z"
}
```

### 3. João cria um plano de treino para Maria

```bash
POST http://localhost:3001/api/training-plans
Content-Type: application/json
Authorization: Bearer {JOAO_TOKEN}

{
  "student_id": 1,
  "title": "Hipertrofia - Fevereiro/2026",
  "description": "Plano focado em ganho de massa muscular com treino full body",
  "start_date": "2026-02-01",
  "end_date": "2026-02-28",
  "modality": "musculacao",
  "frequency": 4
}
```

**Resposta:**
```json
{
  "id": 1,
  "student_id": 1,
  "trainer_id": 1,
  "title": "Hipertrofia - Fevereiro/2026",
  "description": "Plano focado em ganho de massa muscular com treino full body",
  "start_date": "2026-02-01",
  "end_date": "2026-02-28",
  "modality": "musculacao",
  "frequency": 4,
  "status": "active",
  "created_at": "2026-01-28T10:15:00Z",
  "updated_at": "2026-01-28T10:15:00Z"
}
```

### 4. João cria treinos para segunda-feira

```bash
POST http://localhost:3001/api/workouts
Content-Type: application/json
Authorization: Bearer {JOAO_TOKEN}

{
  "training_plan_id": 1,
  "day_of_week": 1,
  "name": "Peito e Tríceps",
  "description": "Dia focado em desenvolvimento de peito e tríceps",
  "duration_minutes": 60,
  "difficulty": "intermediario"
}
```

**Resposta:**
```json
{
  "id": 1,
  "training_plan_id": 1,
  "day_of_week": 1,
  "name": "Peito e Tríceps",
  "description": "Dia focado em desenvolvimento de peito e tríceps",
  "duration_minutes": 60,
  "difficulty": "intermediario",
  "created_at": "2026-01-28T10:30:00Z",
  "updated_at": "2026-01-28T10:30:00Z"
}
```

### 5. João adiciona exercícios ao treino de segunda

```bash
POST http://localhost:3001/api/exercises
Content-Type: application/json
Authorization: Bearer {JOAO_TOKEN}

{
  "workout_id": 1,
  "name": "Supino Reto com Barra",
  "series": 4,
  "repetitions": "8-10",
  "weight": 80,
  "rest_seconds": 90,
  "notes": "Usar barra olímpica, atenção à forma",
  "exercise_order": 1
}
```

**Resposta:**
```json
{
  "id": 1,
  "workout_id": 1,
  "name": "Supino Reto com Barra",
  "series": 4,
  "repetitions": "8-10",
  "weight": 80,
  "duration_seconds": null,
  "rest_seconds": 90,
  "notes": "Usar barra olímpica, atenção à forma",
  "exercise_order": 1,
  "created_at": "2026-01-28T10:45:00Z",
  "updated_at": "2026-01-28T10:45:00Z"
}
```

Adiciona mais exercícios:

```bash
POST http://localhost:3001/api/exercises
Content-Type: application/json
Authorization: Bearer {JOAO_TOKEN}

{
  "workout_id": 1,
  "name": "Supino Inclinado",
  "series": 3,
  "repetitions": "10-12",
  "weight": 50,
  "rest_seconds": 75,
  "notes": "Foco na parte superior do peito",
  "exercise_order": 2
}
```

```bash
POST http://localhost:3001/api/exercises
Content-Type: application/json
Authorization: Bearer {JOAO_TOKEN}

{
  "workout_id": 1,
  "name": "Tríceps Corda",
  "series": 3,
  "repetitions": "12-15",
  "weight": 25,
  "rest_seconds": 60,
  "notes": "Controle a descida",
  "exercise_order": 3
}
```

### 6. Maria visualiza seu plano de treino

Maria faz login em http://localhost:3000 com `maria@email.com` / `senha456`

Ela consegue:
- Ver seu dashboard com seus planos
- Ver os detalhes do plano de treino
- Ver todos os exercícios de segunda-feira
- Registrar que completou os exercícios

### 7. Maria registra seu progresso

Após completar o treino de segunda-feira:

```bash
POST http://localhost:3001/api/progress
Content-Type: application/json
Authorization: Bearer {MARIA_TOKEN}

{
  "student_id": 1,
  "workout_date": "2026-02-02",
  "workout_id": 1,
  "notes": "Consegui completar todas as séries! Supino foi forte",
  "completed": true
}
```

**Resposta:**
```json
{
  "id": 1,
  "student_id": 1,
  "workout_date": "2026-02-02",
  "workout_id": 1,
  "notes": "Consegui completar todas as séries! Supino foi forte",
  "completed": true,
  "created_at": "2026-02-02T18:00:00Z",
  "updated_at": "2026-02-02T18:00:00Z"
}
```

### 8. João acompanha o progresso de Maria

João pode ver o progresso de Maria:

```bash
GET http://localhost:3001/api/progress/student/1
Authorization: Bearer {JOAO_TOKEN}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "workout_date": "2026-02-02",
    "workout_id": 1,
    "notes": "Consegui completar todas as séries! Supino foi forte",
    "completed": true,
    "created_at": "2026-02-02T18:00:00Z",
    "updated_at": "2026-02-02T18:00:00Z"
  }
]
```

### 9. João atualiza o plano de Maria para próxima semana

Após 2 semanas, João quer aumentar a dificuldade:

```bash
PUT http://localhost:3001/api/training-plans/1
Content-Type: application/json
Authorization: Bearer {JOAO_TOKEN}

{
  "title": "Hipertrofia - Fevereiro/2026 (Intensificado)",
  "description": "Aumentamos o volume e a intensidade conforme solicitado"
}
```

### 10. João adiciona mais um aluno

João adiciona Pedro, outro aluno interessado em corrida:

```bash
# Pedro registra conta
POST http://localhost:3001/api/auth/register
Body: { email: "pedro@email.com", password: "senha789", name: "Pedro Costa", role: "student" }
# Recebe user_id: 3

# João registra Pedro como aluno
POST http://localhost:3001/api/students
Authorization: Bearer {JOAO_TOKEN}
Body: {
  "user_id": 3,
  "age": 35,
  "weight": 95,
  "height": 1.80,
  "gender": "M",
  "modality": "corrida",
  "medical_restrictions": "Problema no joelho esquerdo"
}
```

---

## Exemplos de Requests com REST Client

Crie um arquivo `requests.http` na raiz do projeto:

```http
### Variáveis
@baseUrl = http://localhost:3001/api
@joaoToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
@mariaToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### 1. Register Trainer
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "joao@trainer.com",
  "password": "senha123",
  "name": "João Silva",
  "role": "trainer"
}

### 2. Register Student
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "maria@email.com",
  "password": "senha456",
  "name": "Maria Santos",
  "role": "student"
}

### 3. Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "joao@trainer.com",
  "password": "senha123"
}

### 4. Create Student
POST {{baseUrl}}/students
Content-Type: application/json
Authorization: Bearer {{joaoToken}}

{
  "user_id": 2,
  "age": 28,
  "weight": 72.5,
  "height": 1.68,
  "gender": "F",
  "modality": "musculacao"
}

### 5. Get Students
GET {{baseUrl}}/students
Authorization: Bearer {{joaoToken}}

### 6. Create Training Plan
POST {{baseUrl}}/training-plans
Content-Type: application/json
Authorization: Bearer {{joaoToken}}

{
  "student_id": 1,
  "title": "Hipertrofia - Fevereiro/2026",
  "description": "Plano focado em ganho de massa",
  "start_date": "2026-02-01",
  "end_date": "2026-02-28",
  "modality": "musculacao",
  "frequency": 4
}

### 7. Get Training Plans
GET {{baseUrl}}/training-plans
Authorization: Bearer {{joaoToken}}

### 8. Create Workout
POST {{baseUrl}}/workouts
Content-Type: application/json
Authorization: Bearer {{joaoToken}}

{
  "training_plan_id": 1,
  "day_of_week": 1,
  "name": "Peito e Tríceps",
  "duration_minutes": 60,
  "difficulty": "intermediario"
}

### 9. Create Exercise
POST {{baseUrl}}/exercises
Content-Type: application/json
Authorization: Bearer {{joaoToken}}

{
  "workout_id": 1,
  "name": "Supino Reto",
  "series": 4,
  "repetitions": "8-10",
  "weight": 80,
  "rest_seconds": 90,
  "exercise_order": 1
}

### 10. Register Progress
POST {{baseUrl}}/progress
Content-Type: application/json
Authorization: Bearer {{mariaToken}}

{
  "student_id": 1,
  "workout_date": "2026-02-02",
  "workout_id": 1,
  "completed": true,
  "notes": "Consegui completar todas as séries!"
}

### 11. Get Progress
GET {{baseUrl}}/progress/student/1
Authorization: Bearer {{joaoToken}}

### 12. Health Check
GET {{baseUrl}}/health
```

---

## Fluxo de Negócio Completo

```
┌─────────────────────┐
│  Trainer João       │
│  Cria conta         │
└──────────┬──────────┘
           │
           ├──────────────────┐
           │                  │
      ┌────▼────┐        ┌────▼────┐
      │  Maria  │        │  Pedro  │
      │ Student │        │ Student │
      └────┬────┘        └────┬────┘
           │                  │
      ┌────▼──────────────────▼────┐
      │  João cria planos de       │
      │  treino para cada um       │
      └────┬──────────────────┬────┘
           │                  │
      ┌────▼────┐        ┌────▼────┐
      │Treinos  │        │ Treinos │
      │Musculação        │ Corrida  │
      └────┬────┘        └────┬────┘
           │                  │
      ┌────▼────┐        ┌────▼────┐
      │Exercícios        │Exercícios
      │Supino   │        │ Corrida  │
      │Leg press        │ Velocidade
      └────┬────┘        └────┬────┘
           │                  │
      ┌────▼──────────────────▼────┐
      │  Maria e Pedro executam    │
      │  treinos e registram       │
      │  progresso                 │
      └────┬──────────────────┬────┘
           │                  │
      ┌────▼────┐        ┌────▼────┐
      │Logs de  │        │Logs de  │
      │Progresso│        │Progresso│
      └────┬────┘        └────┬────┘
           │                  │
      ┌────▼──────────────────▼────┐
      │  João acompanha            │
      │  progresso de ambos        │
      └────────────────────────────┘
```

---

Este exemplo ilustra o uso completo do Fitness Tracker, desde o registro até o acompanhamento de progresso!

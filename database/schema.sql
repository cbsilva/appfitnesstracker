-- =====================================================
-- Fitness Tracker - Database Schema
-- Script SQL para criar todas as tabelas
-- Compatível com PostgreSQL e Supabase
-- =====================================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('trainer', 'student')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trainer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age INT,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  gender VARCHAR(10),
  modality VARCHAR(50) CHECK (modality IN ('musculacao', 'corrida', 'ambos')),
  medical_restrictions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Planos de Treino
CREATE TABLE IF NOT EXISTS training_plans (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  trainer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  modality VARCHAR(50) NOT NULL CHECK (modality IN ('musculacao', 'corrida', 'ambos')),
  frequency INT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Treinos
CREATE TABLE IF NOT EXISTS workouts (
  id SERIAL PRIMARY KEY,
  training_plan_id INT NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT,
  difficulty VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Exercícios
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  series INT NOT NULL,
  repetitions VARCHAR(50),
  weight DECIMAL(6,2),
  duration_seconds INT,
  rest_seconds INT,
  notes TEXT,
  exercise_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Progresso
CREATE TABLE IF NOT EXISTS progress_logs (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  workout_date DATE NOT NULL,
  workout_id INT REFERENCES workouts(id),
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Índices para melhorar performance
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_trainer_id ON students(trainer_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_training_plans_student_id ON training_plans(student_id);
CREATE INDEX idx_training_plans_trainer_id ON training_plans(trainer_id);
CREATE INDEX idx_workouts_training_plan_id ON workouts(training_plan_id);
CREATE INDEX idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX idx_progress_logs_student_id ON progress_logs(student_id);
CREATE INDEX idx_progress_logs_workout_id ON progress_logs(workout_id);

-- =====================================================
-- Script criado para Fitness Tracker
-- Data: 28 de Janeiro de 2026
-- =====================================================

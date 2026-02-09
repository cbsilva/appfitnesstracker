import pool from './pool.js';
import bcrypt from 'bcrypt';

export async function initializeDatabase() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('trainer', 'student')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Students table
    await pool.query(`
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
    `);

    // Training Plans table
    await pool.query(`
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
    `);

    // Workouts table
    await pool.query(`
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
    `);

    // Ensure workouts.modality column exists (optional)
    await pool.query(`
      ALTER TABLE workouts
      ADD COLUMN IF NOT EXISTS modality VARCHAR(50);
    `);

    // Exercises table
    await pool.query(`
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
    `);

    // Ensure exercises has equipment_type and muscle_group columns
    await pool.query(`
      ALTER TABLE exercises
      ADD COLUMN IF NOT EXISTS equipment_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS muscle_group VARCHAR(50);
    `);

    // Progress tracking table
    await pool.query(`
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
    `);

    console.log('Database initialized successfully');

    // Create default user if not exists
    try {
      const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'trainer@example.com';
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Password123!';
      const defaultName = process.env.DEFAULT_ADMIN_NAME || 'Admin Trainer';
      const defaultRole = process.env.DEFAULT_ADMIN_ROLE || 'trainer';

      const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [defaultEmail]);
      if (userCheck.rows.length === 0) {
        const hashed = await bcrypt.hash(defaultPassword, 10);
        await pool.query(
          'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
          [defaultEmail, hashed, defaultName, defaultRole]
        );
        console.log(`Default user created: ${defaultEmail}`);
      } else {
        console.log(`Default user already exists: ${defaultEmail}`);
      }
    } catch (err) {
      console.error('Error creating default user:', err);
    }
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

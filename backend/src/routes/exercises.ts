import { Router, Response } from 'express';
import pool from '../database/pool.js';
import { authMiddleware, trainerOnly, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { workout_id, name, series, repetitions, weight, duration_seconds, rest_seconds, notes, exercise_order } = req.body;

    if (!workout_id || !name || !series) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const result = await pool.query(
      `INSERT INTO exercises 
       (workout_id, name, series, repetitions, weight, duration_seconds, rest_seconds, notes, exercise_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [workout_id, name, series, repetitions, weight, duration_seconds, rest_seconds, notes, exercise_order || 1]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create exercise error:', err);
    res.status(500).json({ error: 'Erro ao criar exercício' });
  }
});

router.get('/workout/:workoutId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { workoutId } = req.params;

    const result = await pool.query(
      'SELECT * FROM exercises WHERE workout_id = $1 ORDER BY exercise_order',
      [workoutId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get exercises error:', err);
    res.status(500).json({ error: 'Erro ao buscar exercícios' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await pool.query(
      `SELECT e.* FROM exercises e
       JOIN workouts w ON e.workout_id = w.id
       JOIN training_plans tp ON w.training_plan_id = tp.id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    const exercise = result.rows[0];

    // Obter informações do plano de treino
    const planResult = await pool.query(
      `SELECT tp.trainer_id, tp.student_id FROM training_plans tp
       JOIN workouts w ON tp.id = w.training_plan_id
       WHERE w.id = $1`,
      [exercise.workout_id]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plano de treino não encontrado' });
    }

    const plan = planResult.rows[0];

    // Validar acesso: trainer vê exercícios de seus alunos, aluno vê seus próprios exercícios
    if (role === 'trainer') {
      if (plan.trainer_id !== userId) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    } else if (role === 'student') {
      const studentCheck = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND user_id = $2',
        [plan.student_id, userId]
      );
      if (studentCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    } else {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    res.json(exercise);
  } catch (err) {
    console.error('Get exercise error:', err);
    res.status(500).json({ error: 'Erro ao buscar exercício' });
  }
});

router.put('/:id', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, series, repetitions, weight, duration_seconds, rest_seconds, notes, exercise_order } = req.body;

    const result = await pool.query(
      `UPDATE exercises 
       SET name = COALESCE($1, name),
           series = COALESCE($2, series),
           repetitions = COALESCE($3, repetitions),
           weight = COALESCE($4, weight),
           duration_seconds = COALESCE($5, duration_seconds),
           rest_seconds = COALESCE($6, rest_seconds),
           notes = COALESCE($7, notes),
           exercise_order = COALESCE($8, exercise_order),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, series, repetitions, weight, duration_seconds, rest_seconds, notes, exercise_order, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update exercise error:', err);
    res.status(500).json({ error: 'Erro ao atualizar exercício' });
  }
});

router.delete('/:id', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM exercises WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    res.json({ message: 'Exercício deletado com sucesso' });
  } catch (err) {
    console.error('Delete exercise error:', err);
    res.status(500).json({ error: 'Erro ao deletar exercício' });
  }
});

export default router;

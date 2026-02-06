import { Router, Response } from 'express';
import pool from '../database/pool';
import { authMiddleware, trainerOnly, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { training_plan_id, day_of_week, name, description, duration_minutes, difficulty } = req.body;

    if (!training_plan_id || !day_of_week || !name) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const result = await pool.query(
      `INSERT INTO workouts 
       (training_plan_id, day_of_week, name, description, duration_minutes, difficulty) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [training_plan_id, day_of_week, name, description, duration_minutes, difficulty]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create workout error:', err);
    res.status(500).json({ error: 'Erro ao criar treino' });
  }
});

router.get('/plan/:planId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { planId } = req.params;

    const result = await pool.query(
      'SELECT * FROM workouts WHERE training_plan_id = $1 ORDER BY day_of_week',
      [planId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get workouts error:', err);
    res.status(500).json({ error: 'Erro ao buscar treinos' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await pool.query(
      `SELECT w.* FROM workouts w
       JOIN training_plans tp ON w.training_plan_id = tp.id
       WHERE w.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    const workout = result.rows[0];

    // Obter informações do plano de treino
    const planResult = await pool.query(
      'SELECT trainer_id, student_id FROM training_plans WHERE id = $1',
      [workout.training_plan_id]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plano de treino não encontrado' });
    }

    const plan = planResult.rows[0];

    // Validar acesso: trainer vê treinos de seus alunos, aluno vê seu próprio treino
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

    res.json(workout);
  } catch (err) {
    console.error('Get workout error:', err);
    res.status(500).json({ error: 'Erro ao buscar treino' });
  }
});

router.put('/:id', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, duration_minutes, difficulty } = req.body;

    const result = await pool.query(
      `UPDATE workouts 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           duration_minutes = COALESCE($3, duration_minutes),
           difficulty = COALESCE($4, difficulty),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description, duration_minutes, difficulty, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update workout error:', err);
    res.status(500).json({ error: 'Erro ao atualizar treino' });
  }
});

router.delete('/:id', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM workouts WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    res.json({ message: 'Treino deletado com sucesso' });
  } catch (err) {
    console.error('Delete workout error:', err);
    res.status(500).json({ error: 'Erro ao deletar treino' });
  }
});

export default router;

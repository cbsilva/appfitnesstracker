import { Router, Response } from 'express';
import pool from '../database/pool.js';
import { authMiddleware, trainerOnly, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { student_id, title, description, start_date, end_date, modality, frequency } = req.body;

    if (!student_id || !title || !start_date || !modality) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const result = await pool.query(
      `INSERT INTO training_plans 
       (student_id, trainer_id, title, description, start_date, end_date, modality, frequency) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [student_id, req.user?.id, title, description, start_date, end_date, modality, frequency || 3]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create plan error:', err);
    res.status(500).json({ error: 'Erro ao criar plano' });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let query = 'SELECT * FROM training_plans';
    const params: any[] = [];

    if (role === 'trainer') {
      query += ' WHERE trainer_id = $1';
      params.push(userId);
    } else if (role === 'student') {
      query += ' WHERE student_id = (SELECT id FROM students WHERE user_id = $1)';
      params.push(userId);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get plans error:', err);
    res.status(500).json({ error: 'Erro ao buscar planos' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await pool.query('SELECT * FROM training_plans WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    const plan = result.rows[0];

    // Validar acesso: trainer vê seus próprios planos, aluno vê plano atribuído a ele
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

    res.json(plan);
  } catch (err) {
    console.error('Get plan error:', err);
    res.status(500).json({ error: 'Erro ao buscar plano' });
  }
});

router.put('/:id', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, end_date, status } = req.body;

    const result = await pool.query(
      `UPDATE training_plans 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description),
           end_date = COALESCE($3, end_date),
           status = COALESCE($4, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND trainer_id = $6
       RETURNING *`,
      [title, description, end_date, status, id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update plan error:', err);
    res.status(500).json({ error: 'Erro ao atualizar plano' });
  }
});

router.delete('/:id', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM training_plans WHERE id = $1 AND trainer_id = $2 RETURNING id',
      [id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    res.json({ message: 'Plano deletado com sucesso' });
  } catch (err) {
    console.error('Delete plan error:', err);
    res.status(500).json({ error: 'Erro ao deletar plano' });
  }
});

export default router;

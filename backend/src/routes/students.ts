import { Router, Response } from 'express';
import pool from '../database/pool';
import { authMiddleware, trainerOnly, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { user_id, age, weight, height, gender, modality, medical_restrictions } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório' });
    }

    const result = await pool.query(
      `INSERT INTO students 
       (user_id, trainer_id, age, weight, height, gender, modality, medical_restrictions) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [user_id, req.user?.id, age, weight, height, gender, modality, medical_restrictions]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let query = 'SELECT s.*, u.email, u.name FROM students s JOIN users u ON s.user_id = u.id';
    const params: any[] = [];

    if (role === 'trainer') {
      query += ' WHERE s.trainer_id = $1';
      params.push(userId);
    } else if (role === 'student') {
      query += ' WHERE s.user_id = $1';
      params.push(userId);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    let query = 'SELECT s.*, u.email, u.name FROM students s JOIN users u ON s.user_id = u.id WHERE s.id = $1';
    const params: any[] = [id];

    // Trainer só vê seus próprios alunos, estudante só vê a si mesmo
    if (role === 'trainer') {
      query += ' AND s.trainer_id = $2';
      params.push(userId);
    } else if (role === 'student') {
      query += ' AND s.user_id = $2';
      params.push(userId);
    } else {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado ou acesso não autorizado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});

router.put('/:id', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { age, weight, height, gender, modality, medical_restrictions } = req.body;

    const result = await pool.query(
      `UPDATE students 
       SET age = COALESCE($1, age),
           weight = COALESCE($2, weight),
           height = COALESCE($3, height),
           gender = COALESCE($4, gender),
           modality = COALESCE($5, modality),
           medical_restrictions = COALESCE($6, medical_restrictions),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND trainer_id = $8
       RETURNING *`,
      [age, weight, height, gender, modality, medical_restrictions, id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

router.delete('/:id', authMiddleware, trainerOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM students WHERE id = $1 AND trainer_id = $2 RETURNING id',
      [id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({ message: 'Aluno deletado com sucesso' });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
});

export default router;

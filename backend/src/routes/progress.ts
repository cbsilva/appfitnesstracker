import { Router, Response } from 'express';
import pool from '../database/pool';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { student_id, workout_date, workout_id, notes, completed } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!student_id || !workout_date) {
      return res.status(400).json({ error: 'student_id e workout_date são obrigatórios' });
    }

    // Validar que o aluno registra apenas seu próprio progresso
    if (role === 'student') {
      const studentCheckResult = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND user_id = $2',
        [student_id, userId]
      );

      if (studentCheckResult.rows.length === 0) {
        return res.status(403).json({ error: 'Você só pode registrar seu próprio progresso' });
      }
    } else if (role !== 'trainer') {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    const result = await pool.query(
      `INSERT INTO progress_logs 
       (student_id, workout_date, workout_id, notes, completed) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [student_id, workout_date, workout_id, notes, completed || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create progress log error:', err);
    res.status(500).json({ error: 'Erro ao registrar progresso' });
  }
});

router.get('/student/:studentId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    // Validar acesso: trainer vê alunos dele, aluno vê apenas a si mesmo
    if (role === 'trainer') {
      const studentCheck = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND trainer_id = $2',
        [studentId, userId]
      );
      if (studentCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    } else if (role === 'student') {
      const studentCheck = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND user_id = $2',
        [studentId, userId]
      );
      if (studentCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    } else {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    const result = await pool.query(
      'SELECT * FROM progress_logs WHERE student_id = $1 ORDER BY workout_date DESC',
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get progress logs error:', err);
    res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await pool.query('SELECT * FROM progress_logs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de progresso não encontrado' });
    }

    const progressLog = result.rows[0];

    // Validar acesso: trainer vê progresso de seus alunos, aluno vê apenas seu próprio
    if (role === 'trainer') {
      const studentCheck = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND trainer_id = $2',
        [progressLog.student_id, userId]
      );
      if (studentCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    } else if (role === 'student') {
      const studentCheck = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND user_id = $2',
        [progressLog.student_id, userId]
      );
      if (studentCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    } else {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    res.json(progressLog);
  } catch (err) {
    console.error('Get progress log error:', err);
    res.status(500).json({ error: 'Erro ao buscar registro de progresso' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes, completed } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;

    // Primeiro obter o registro de progresso
    const progressCheckResult = await pool.query(
      'SELECT student_id FROM progress_logs WHERE id = $1',
      [id]
    );

    if (progressCheckResult.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de progresso não encontrado' });
    }

    const studentId = progressCheckResult.rows[0].student_id;

    // Validar autorização
    if (role === 'trainer') {
      const studentCheck = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND trainer_id = $2',
        [studentId, userId]
      );
      if (studentCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    } else if (role === 'student') {
      const studentCheck = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND user_id = $2',
        [studentId, userId]
      );
      if (studentCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    } else {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    const result = await pool.query(
      `UPDATE progress_logs 
       SET notes = COALESCE($1, notes),
           completed = COALESCE($2, completed),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [notes, completed, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update progress log error:', err);
    res.status(500).json({ error: 'Erro ao atualizar registro de progresso' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM progress_logs WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de progresso não encontrado' });
    }

    res.json({ message: 'Registro deletado com sucesso' });
  } catch (err) {
    console.error('Delete progress log error:', err);
    res.status(500).json({ error: 'Erro ao deletar registro de progresso' });
  }
});

export default router;

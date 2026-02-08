import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trainingService, TrainingPlan as TrainingPlanType } from '../services/trainingService';
import { studentService, Student } from '../services/studentService';
import '../styles/TrainingPlan.css';

export default function TrainingPlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    modality: 'musculacao' as 'musculacao' | 'corrida' | 'ambos',
    frequency: 4,
    status: 'active' as 'active' | 'paused' | 'completed',
  });

  useEffect(() => {
    fetchStudents();
    if (!isNew) {
      fetchPlan();
    }
  }, [id, isNew]);

  const fetchStudents = async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
    }
  };

  const fetchPlan = async () => {
    if (!id || isNew) return;

    try {
      const data = await trainingService.getPlanById(parseInt(id));
      setFormData({
        student_id: data.student_id.toString(),
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        modality: data.modality,
        frequency: data.frequency,
        status: data.status,
      });
    } catch (err) {
      console.error('Erro ao buscar plano:', err);
      setError('Erro ao carregar plano');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'frequency' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.student_id || !formData.title || !formData.start_date) {
      setError('Aluno, título e data de início são obrigatórios');
      return;
    }

    try {
      if (isNew) {
        const newPlan = await trainingService.createPlan({
          ...formData,
          student_id: parseInt(formData.student_id),
          trainer_id: 0, // Será setado pelo backend
        });
        setSuccess('Plano de treino criado com sucesso!');
        setTimeout(() => navigate(`/training-plan/${newPlan.id}`), 2000);
      } else {
        const updateData: Partial<TrainingPlanType> = {
          ...formData,
          student_id: parseInt(formData.student_id),
        };
        await trainingService.updatePlan(parseInt(id!), updateData);
        setSuccess('Plano de treino atualizado com sucesso!');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar plano');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este plano?')) return;

    try {
      await trainingService.deletePlan(parseInt(id!));
      setSuccess('Plano deletado com sucesso!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao deletar plano');
    }
  };

  if (loading) return <div className="loading">Carregando plano...</div>;

  return (
    <div className="training-plan-container">
      <header className="training-plan-header">
        <h1>{isNew ? 'Novo Plano de Treino' : 'Editar Plano de Treino'}</h1>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          ← Voltar
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="training-plan-form">
        <div className="form-section">
          <h2>Informações Básicas</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="student_id">Aluno *</label>
              <select
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleInputChange}
                required
                disabled={!isNew}
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Título do Plano *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Ex: Ganho de Massa Muscular"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva os objetivos e detalhes do plano..."
              rows={4}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Configuração do Plano</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modality">Modalidade *</label>
              <select
                id="modality"
                name="modality"
                value={formData.modality}
                onChange={handleInputChange}
                required
              >
                <option value="musculacao">💪 Musculação</option>
                <option value="corrida">🏃 Corrida</option>
                <option value="ambos">🏋️ Ambos</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Frequência (dias/semana) *</label>
              <input
                type="number"
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                required
                min="1"
                max="7"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">🟢 Ativo</option>
                <option value="paused">🟡 Pausado</option>
                <option value="completed">✓ Completo</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Data de Início *</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">Data de Término</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isNew ? '✓ Criar Plano' : '✓ Atualizar Plano'}
          </button>

          {!isNew && (
            <>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
              >
                🗑️ Deletar Plano
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(`/training-plan/${id}/workouts`)}
              >
                📋 Gerenciar Treinos
              </button>
            </>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

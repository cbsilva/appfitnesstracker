import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import { trainingService, TrainingPlan } from '../services/trainingService';
import '../styles/NewWorkout.css';

export default function NewWorkout() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);

  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    name: '',
    description: '',
    durationMinutes: 60,
    difficulty: 'intermediario',
    modality: 'musculacao', // musculacao or corrida
    muscleGroup: 'superiores', // para musculacao
    equipmentType: 'barra', // barra, halter, livre
    runningType: 'moderada', // para corrida
  });

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      if (!planId) return;
      const data = await trainingService.getPlan(parseInt(planId));
      setPlan(data);
      setFormData((prev) => ({
        ...prev,
        modality: data.modality || 'musculacao',
      }));
    } catch (err) {
      console.error('Erro ao buscar plano:', err);
      setError('Erro ao buscar dados do plano');
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
      [name]: name === 'durationMinutes' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name) {
      setError('Nome do treino é obrigatório');
      setLoading(false);
      return;
    }

    if (!planId) {
      setError('ID do plano não encontrado');
      setLoading(false);
      return;
    }

    try {
      await workoutService.createWorkout({
        training_plan_id: parseInt(planId),
        day_of_week: formData.dayOfWeek,
        name: formData.name,
        description: formData.description || undefined,
        duration_minutes: formData.durationMinutes,
        difficulty: formData.difficulty,
        modality: formData.modality,
      });

      setSuccess('✓ Treino criado com sucesso!');
      setTimeout(() => navigate(`/workouts/${planId}`), 1500);
    } catch (err: any) {
      console.error('Erro ao criar treino:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erro ao criar treino'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !plan) return <div className="loading">Carregando...</div>;

  return (
    <div className="new-workout-container">
      <header className="new-workout-header">
        <h1>Novo Treino</h1>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="new-workout-form">
        <div className="form-section">
          <h2>Informações Básicas</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome do Treino *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ex: Supino + Rosca Direta"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dayOfWeek">Dia da Semana *</label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleInputChange}
                required
              >
                <option value={1}>🔵 Segunda-feira</option>
                <option value={2}>🔵 Terça-feira</option>
                <option value={3}>🔵 Quarta-feira</option>
                <option value={4}>🔵 Quinta-feira</option>
                <option value={5}>🔵 Sexta-feira</option>
                <option value={6}>⚪ Sábado</option>
                <option value={7}>⚪ Domingo</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o treino..."
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Configuração</h2>

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
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="durationMinutes">Duração (minutos) *</label>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                required
                min="15"
                max="180"
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Dificuldade *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
              >
                <option value="facil">🟢 Fácil</option>
                <option value="intermediario">🟡 Intermediário</option>
                <option value="dificil">🔴 Difícil</option>
              </select>
            </div>
          </div>
        </div>

        {formData.modality === 'musculacao' && (
          <div className="form-section">
            <h2>Musculação - Configurações Específicas</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="muscleGroup">Grupo Muscular *</label>
                <select
                  id="muscleGroup"
                  name="muscleGroup"
                  value={formData.muscleGroup}
                  onChange={handleInputChange}
                  required
                >
                  <option value="superiores">💪 Membros Superiores (Peito, Costas, Ombros, Braços)</option>
                  <option value="inferiores">🦵 Membros Inferiores (Pernas, Glúteos)</option>
                  <option value="core">🎯 Core (Abdômen, Costas Inferiores)</option>
                  <option value="full">🏋️ Full Body (Corpo Inteiro)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="equipmentType">Tipo de Equipamento *</label>
                <select
                  id="equipmentType"
                  name="equipmentType"
                  value={formData.equipmentType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="barra">⎯ Barra</option>
                  <option value="halter">🔟 Halteres</option>
                  <option value="livre">✋ Peso Corporal / Livre</option>
                  <option value="maquina">⚙️ Máquina</option>
                </select>
              </div>
            </div>

            <div className="info-box">
              <p>
                <strong>Próximo:</strong> Os exercícios para este treino serão adicionados na próxima tela
              </p>
            </div>
          </div>
        )}

        {formData.modality === 'corrida' && (
          <div className="form-section">
            <h2>Corrida - Configurações Específicas</h2>

            <div className="form-group">
              <label htmlFor="runningType">Tipo de Corrida *</label>
              <select
                id="runningType"
                name="runningType"
                value={formData.runningType}
                onChange={handleInputChange}
                required
              >
                <option value="leve">🟢 Leve (Baixa Intensidade)</option>
                <option value="moderada">🟡 Moderada (Média Intensidade)</option>
                <option value="forte">🔴 Forte (Alta Intensidade)</option>
                <option value="sprint">⚡ Sprint (Explosiva)</option>
                <option value="intervalo">↔️ Intervalo (Variada)</option>
              </select>
            </div>

            <div className="info-box">
              <p>
                <strong>Nota:</strong> Configure a distância ou duração acima
              </p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Criando...' : '✓ Criar Treino'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

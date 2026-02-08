import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutService, Workout } from '../services/workoutService';
import { exerciseService, Exercise } from '../services/exerciseService';
import '../styles/Exercises.css';

export default function Exercises() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    series: 3,
    reps: 12,
    weight: '',
    duration_seconds: '',
    rest_seconds: 60,
    notes: '',
    equipment_type: 'barra',
    muscle_group: 'superiores',
  });

  useEffect(() => {
    fetchData();
  }, [workoutId]);

  const fetchData = async () => {
    try {
      if (!workoutId) return;
      const id = parseInt(workoutId);
      const workoutData = await workoutService.getWorkout(id);
      setWorkout(workoutData);
      const exercisesData = await exerciseService.getExercisesByWorkout(id);
      setExercises(exercisesData.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar exercícios');
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
      [name]:
        name === 'series' || name === 'reps' || name === 'rest_seconds' || name === 'duration_seconds'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name) {
      setError('Nome do exercício é obrigatório');
      setLoading(false);
      return;
    }

    if (!workoutId) {
      setError('ID do treino não encontrado');
      setLoading(false);
      return;
    }

    try {
      const newExercise = await exerciseService.createExercise({
        workout_id: parseInt(workoutId),
        name: formData.name,
        series: formData.series,
        reps: formData.reps || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        duration_seconds: formData.duration_seconds || undefined,
        rest_seconds: formData.rest_seconds,
        notes: formData.notes || undefined,
        equipment_type: formData.equipment_type,
        muscle_group: formData.muscle_group,
        order: exercises.length + 1,
      });

      setExercises([...exercises, newExercise]);
      setSuccess('✓ Exercício adicionado com sucesso!');
      setFormData({
        name: '',
        series: 3,
        reps: 12,
        weight: '',
        duration_seconds: '',
        rest_seconds: 60,
        notes: '',
        equipment_type: 'barra',
        muscle_group: 'superiores',
      });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Erro ao criar exercício:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erro ao adicionar exercício'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este exercício?')) return;

    try {
      setLoading(true);
      await exerciseService.deleteExercise(id);
      setExercises(exercises.filter((e) => e.id !== id));
      setSuccess('✓ Exercício deletado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erro ao deletar exercício'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !workout) return <div className="loading">Carregando...</div>;

  return (
    <div className="exercises-container">
      <header className="exercises-header">
        <div>
          <h1>{workout?.name || 'Exercícios'}</h1>
          <p className="subtitle">
            {['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][workout?.day_of_week || 0]} •
            {workout?.modality === 'musculacao' ? ' 💪 Musculação' : ' 🏃 Corrida'} •
            {workout?.difficulty && ` ${workout.difficulty}`}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <main className="exercises-content">
        <section className="exercises-section">
          <div className="section-header">
            <h2>Exercícios do Treino</h2>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancelar' : '➕ Novo Exercício'}
            </button>
          </div>

          {showForm && (
            <div className="exercise-form-container">
              <h3>Adicionar Novo Exercício</h3>
              <form onSubmit={handleSubmit} className="exercise-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nome do Exercício *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: Supino Reto"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="series">Séries *</label>
                    <input
                      type="number"
                      id="series"
                      name="series"
                      value={formData.series}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                {workout?.modality === 'musculacao' && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="reps">Repetições</label>
                        <input
                          type="number"
                          id="reps"
                          name="reps"
                          value={formData.reps || ''}
                          onChange={handleInputChange}
                          min="1"
                          max="100"
                          placeholder="Ex: 12"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="weight">Peso (kg)</label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          step="0.5"
                          min="0"
                          placeholder="Ex: 50.5"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="rest_seconds">Descanso (segundos)</label>
                        <input
                          type="number"
                          id="rest_seconds"
                          name="rest_seconds"
                          value={formData.rest_seconds}
                          onChange={handleInputChange}
                          required
                          min="10"
                          max="300"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="muscle_group">Grupo Muscular *</label>
                        <select
                          id="muscle_group"
                          name="muscle_group"
                          value={formData.muscle_group}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="superiores">💪 Membros Superiores</option>
                          <option value="inferiores">🦵 Membros Inferiores</option>
                          <option value="core">🎯 Core</option>
                          <option value="full">🏋️ Full Body</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="equipment_type">Tipo de Equipamento *</label>
                        <select
                          id="equipment_type"
                          name="equipment_type"
                          value={formData.equipment_type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="barra">⎯ Barra</option>
                          <option value="halter">🔟 Halteres</option>
                          <option value="livre">✋ Peso Corporal</option>
                          <option value="maquina">⚙️ Máquina</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {workout?.modality === 'corrida' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="duration_seconds">Duração (segundos)</label>
                      <input
                        type="number"
                        id="duration_seconds"
                        name="duration_seconds"
                        value={formData.duration_seconds}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Ex: 300 (5 minutos)"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rest_seconds">Descanso (segundos)</label>
                      <input
                        type="number"
                        id="rest_seconds"
                        name="rest_seconds"
                        value={formData.rest_seconds}
                        onChange={handleInputChange}
                        required
                        min="10"
                        placeholder="Ex: 60"
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="notes">Notas (observações)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Técnica, observações importantes..."
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Salvando...' : '✓ Adicionar Exercício'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {exercises.length === 0 ? (
            <div className="no-data">
              <p>📋 Nenhum exercício cadastrado ainda</p>
              <p className="subtitle">Clique no botão acima para adicionar o primeiro exercício</p>
            </div>
          ) : (
            <div className="exercises-list">
              {exercises.map((ex, index) => (
                <div key={ex.id} className="exercise-card">
                  <div className="exercise-number">#{index + 1}</div>
                  <div className="exercise-content">
                    <h3>{ex.name}</h3>
                    <div className="exercise-details">
                      <span>📊 {ex.series}x</span>
                      {ex.reps && <span>🔁 {ex.reps} reps</span>}
                      {ex.weight && <span>⚖️ {ex.weight}kg</span>}
                      {ex.duration_seconds && <span>⏱️ {Math.floor(ex.duration_seconds / 60)}:{String(ex.duration_seconds % 60).padStart(2, '0')}</span>}
                      <span>💨 {ex.rest_seconds}s descanso</span>
                    </div>
                    {ex.muscle_group && (
                      <div className="exercise-tags">
                        {ex.muscle_group === 'superiores' && <span className="tag">💪 Superiores</span>}
                        {ex.muscle_group === 'inferiores' && <span className="tag">🦵 Inferiores</span>}
                        {ex.muscle_group === 'core' && <span className="tag">🎯 Core</span>}
                        {ex.muscle_group === 'full' && <span className="tag">🏋️ Full Body</span>}
                        {ex.equipment_type && <span className="tag">🔧 {ex.equipment_type}</span>}
                      </div>
                    )}
                    {ex.notes && <p className="exercise-notes">📝 {ex.notes}</p>}
                  </div>
                  <div className="exercise-actions">
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(ex.id)}
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

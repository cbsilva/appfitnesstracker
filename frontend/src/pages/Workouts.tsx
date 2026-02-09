import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButtons from '../components/BackButtons';
import { workoutService, Workout } from '../services/workoutService';
import { exerciseService } from '../services/exerciseService';
import '../styles/Workouts.css';

export default function Workouts() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, [planId]);

  const fetchWorkouts = async () => {
    try {
      if (!planId) return;
      setLoading(true);
      const data = await workoutService.getWorkoutsByPlan(parseInt(planId));

      // Fetch exercises for each workout in parallel so we can show counts
      const withExercises = await Promise.all(
        data.map(async (w) => {
          try {
            const ex = await exerciseService.getExercisesByWorkout(w.id);
            return { ...w, exercises: ex } as Workout;
          } catch (e) {
            return { ...w, exercises: [] } as Workout;
          }
        })
      );

      setWorkouts(withExercises.sort((a, b) => a.day_of_week - b.day_of_week));
    } catch (err) {
      console.error('Erro ao buscar treinos:', err);
      setError('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este treino?')) return;

    try {
      setLoading(true);
      await workoutService.deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w.id !== id));
      setSuccess('✓ Treino deletado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erro ao deletar treino'
      );
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (day: number): string => {
    const days = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    return days[day] || 'Desconhecido';
  };

  if (loading && workouts.length === 0)
    return <div className="loading">Carregando treinos...</div>;

  return (
    <div className="workouts-container">
      <header className="workouts-header">
        <h1>Treinos do Plano #{planId}</h1>
        <BackButtons />
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <main className="workouts-content">
        <section className="workouts-section">
          <div className="section-header">
            <h2>Treinos Cadastrados</h2>
            <button className="btn-primary" onClick={() => navigate(`/workouts/${planId}/new`)}>
              ➕ Novo Treino
            </button>
          </div>

          {workouts.length === 0 ? (
            <div className="no-data">
              <p>📋 Nenhum treino cadastrado ainda</p>
              <p className="subtitle">Clique no botão acima para adicionar o primeiro treino</p>
            </div>
          ) : (
            <div className="workouts-grid">
              {workouts.map((workout) => (
                <div key={workout.id} className="workout-card">
                  <div className="workout-header">
                    <h3>{workout.name}</h3>
                    <span className="day-badge">
                      {getDayName(workout.day_of_week)}
                    </span>
                  </div>

                  {workout.description && (
                    <p className="workout-description">{workout.description}</p>
                  )}

                  <div className="workout-details">
                    <span className="detail-item">⏱️ {workout.duration_minutes}min</span>
                    <span className="detail-item">📊 {workout.difficulty}</span>
                    {workout.modality && (
                      <span className="detail-item">
                        {workout.modality === 'musculacao' ? '💪' : '🏃'} {workout.modality}
                      </span>
                    )}
                  </div>

                  <div className="exercises-count">
                    {workout.exercises && workout.exercises.length > 0 ? (
                      <span>📋 {workout.exercises.length} exercício(s)</span>
                    ) : (
                      <span className="no-exercises">➕ Nenhum exercício cadastrado</span>
                    )}
                  </div>

                  <div className="workout-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/exercises/${workout.id}`)}
                    >
                      {workout.exercises && workout.exercises.length > 0 ? `📋 Ver Exercícios (${workout.exercises.length})` : '➕ Adicionar Exercícios'}
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(workout.id)}
                      disabled={loading}
                    >
                      🗑️ Deletar
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

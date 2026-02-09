import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trainingService, TrainingPlan } from '../services/trainingService';
import { studentService, Student } from '../services/studentService';
import BackButtons from '../components/BackButtons';
import '../styles/StudentPlans.css';

export default function StudentPlans() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentAndPlans();
  }, [id]);

  const fetchStudentAndPlans = async () => {
    try {
      if (id) {
        const studentData = await studentService.getStudentById(parseInt(id));
        setStudent(studentData);

        const plansData = await trainingService.getPlans();
        const studentPlans = plansData.filter((p) => p.student_id === parseInt(id));
        setPlans(studentPlans);
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="student-plans-container">
      <header className="student-plans-header">
        <div>
          <h1>Planos de {student?.name}</h1>
          <p className="student-email">📧 {student?.email}</p>
        </div>
        <BackButtons backTo="/students" />
      </header>

      <main className="student-plans-content">
        <section className="plans-section">
          <div className="section-header">
            <h2>{plans.length} Plano(s) de Treino</h2>
            <button
              className="btn-primary"
              onClick={() => navigate('/training-plan/new')}
            >
              ➕ Novo Plano
            </button>
          </div>

          {plans.length === 0 ? (
            <div className="no-data">
              <p>Nenhum plano de treino para este aluno ainda</p>
              <button
                className="btn-primary"
                onClick={() => navigate('/training-plan/new')}
              >
                Criar Primeiro Plano
              </button>
            </div>
          ) : (
            <div className="plans-grid">
              {plans.map((plan) => (
                <div key={plan.id} className="plan-card">
                  <div className="plan-header">
                    <h3>{plan.title}</h3>
                    <span className="status-badge" data-status={plan.status}>
                      {plan.status === 'active'
                        ? '🟢 Ativo'
                        : plan.status === 'paused'
                        ? '🟡 Pausado'
                        : '✓ Completo'}
                    </span>
                  </div>

                  <p className="plan-description">{plan.description}</p>

                  <div className="plan-details">
                    <span className="modality-badge" data-modality={plan.modality}>
                      {plan.modality === 'musculacao'
                        ? '💪 Musculação'
                        : plan.modality === 'corrida'
                        ? '🏃 Corrida'
                        : '🏋️ Ambos'}
                    </span>
                    <span className="frequency">{`${plan.frequency}x/semana`}</span>
                  </div>

                  <div className="plan-dates">
                    <small>
                      📅 {new Date(plan.start_date).toLocaleDateString('pt-BR')}
                      {plan.end_date &&
                        ` até ${new Date(plan.end_date).toLocaleDateString('pt-BR')}`}
                    </small>
                  </div>

                  <div className="plan-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/training-plan/${plan.id}`)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/workouts/${plan.id}`)}
                    >
                      📋 Treinos
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

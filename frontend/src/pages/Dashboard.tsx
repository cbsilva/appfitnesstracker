import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainingService, TrainingPlan } from '../services/trainingService';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await trainingService.getPlans();
      setPlans(data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Dashboard de Treinos</h1>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className="nav-btn"
          onClick={() => navigate('/students')}
        >
          👥 Meus Alunos
        </button>
        <button
          className="nav-btn nav-btn-primary"
          onClick={() => navigate('/training-plan/new')}
        >
          ➕ Novo Plano
        </button>
      </nav>

      <main className="dashboard-content">
        <section className="plans-section">
          <h2>Planos de Treino</h2>

          {plans.length === 0 ? (
            <div className="no-data">
              <p>📭 Nenhum plano de treino criado ainda</p>
              <button className="btn-primary" onClick={() => navigate('/training-plan/new')}>
                Criar Primeiro Plano
              </button>
            </div>
          ) : (
            <div className="plans-grid">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="plan-card"
                  onClick={() => navigate(`/training-plan/${plan.id}`)}
                >
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
                    <span className="frequency">
                      {`${plan.frequency}x/semana`}
                    </span>
                  </div>

                  <div className="plan-dates">
                    <small>
                      📅 {new Date(plan.start_date).toLocaleDateString('pt-BR')}
                      {plan.end_date &&
                        ` até ${new Date(plan.end_date).toLocaleDateString('pt-BR')}`}
                    </small>
                  </div>

                  <button className="btn-secondary" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/training-plan/${plan.id}`);
                  }}>
                    Editar →
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

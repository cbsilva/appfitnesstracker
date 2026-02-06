import React, { useEffect, useState } from 'react';
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
        <h1>Dashboard de Treinos</h1>
        <button onClick={handleLogout} className="logout-btn">Sair</button>
      </header>

      <main className="dashboard-content">
        <section className="plans-section">
          <h2>Meus Planos de Treino</h2>
          <button className="btn-primary" onClick={() => navigate('/training-plan/new')}>
            + Novo Plano
          </button>

          {plans.length === 0 ? (
            <p className="no-data">Nenhum plano de treino criado ainda</p>
          ) : (
            <div className="plans-grid">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="plan-card"
                  onClick={() => navigate(`/training-plan/${plan.id}`)}
                >
                  <h3>{plan.title}</h3>
                  <p className="modality">{plan.modality}</p>
                  <p className="status" data-status={plan.status}>{plan.status}</p>
                  <small>{plan.frequency}x por semana</small>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

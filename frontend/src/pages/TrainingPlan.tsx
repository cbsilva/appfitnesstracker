import React from 'react';
import { useParams } from 'react-router-dom';

export default function TrainingPlan() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="training-plan">
      <h1>Plano de Treino #{id}</h1>
      <p>Detalhes do plano de treino em desenvolvimento...</p>
    </div>
  );
}

import React from 'react';
import { useParams } from 'react-router-dom';

export default function StudentTracking() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="student-tracking">
      <h1>Acompanhamento do Aluno #{id}</h1>
      <p>Relatório de progresso em desenvolvimento...</p>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

export default function BackButtons({ className, backTo }: { className?: string; backTo?: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className={className} style={{ display: 'flex', gap: '10px' }}>
      <button className="btn-secondary" onClick={handleBack}>
        ← Voltar
      </button>
      <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
        🏠 Dashboard
      </button>
    </div>
  );
}

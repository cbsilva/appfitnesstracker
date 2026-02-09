import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackButtons from '../components/BackButtons';
import { progressService, ProgressLog } from '../services/progressService';
import { studentService, Student } from '../services/studentService';
import '../styles/Progress.css';

export default function Progress() {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    workout_date: new Date().toISOString().split('T')[0],
    notes: '',
    completed: true,
  });

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    try {
      if (!studentId) return;
      const id = parseInt(studentId);
      const studentData = await studentService.getStudentById(id);
      setStudent(studentData);
      const progressData = await progressService.getProgressByStudent(id);
      setProgressLogs(progressData.sort((a, b) => new Date(b.workout_date).getTime() - new Date(a.workout_date).getTime()));
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar progresso');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!studentId) {
      setError('ID do aluno não encontrado');
      setLoading(false);
      return;
    }

    try {
      const newProgress = await progressService.createProgress({
        student_id: parseInt(studentId),
        workout_date: formData.workout_date,
        notes: formData.notes || undefined,
        completed: formData.completed,
      });

      setProgressLogs([newProgress, ...progressLogs]);
      setSuccess('✓ Progresso registrado com sucesso!');
      setFormData({
        workout_date: new Date().toISOString().split('T')[0],
        notes: '',
        completed: true,
      });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Erro ao registrar progresso:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erro ao registrar progresso'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este registro?')) return;

    try {
      setLoading(true);
      await progressService.deleteProgress(id);
      setProgressLogs(progressLogs.filter((log) => log.id !== id));
      setSuccess('✓ Registro deletado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erro ao deletar registro'
      );
    } finally {
      setLoading(false);
    }
  };

  const completedCount = progressLogs.filter((log) => log.completed).length;
  const completionRate =
    progressLogs.length > 0
      ? Math.round((completedCount / progressLogs.length) * 100)
      : 0;

  if (loading && !student) return <div className="loading">Carregando...</div>;

  return (
    <div className="progress-container">
      <header className="progress-header">
        <div>
          <h1>Progresso de {student?.name || 'Aluno'}</h1>
          <p className="subtitle">Acompanhe a evolução do treino</p>
        </div>
        <BackButtons />
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <main className="progress-content">
        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-value">{progressLogs.length}</div>
            <div className="stat-label">Total de Registros</div>
          </div>
          <div className="stat-card success">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Treinos Completos</div>
          </div>
          <div className="stat-card info">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Taxa de Conclusão</div>
          </div>
          {progressLogs.length > 0 && (
            <div className="stat-card">
              <div className="stat-value">
                {new Date(progressLogs[0].workout_date).toLocaleDateString('pt-BR')}
              </div>
              <div className="stat-label">Último Treino</div>
            </div>
          )}
        </section>

        {/* Form Section */}
        <section className="progress-section">
          <div className="section-header">
            <h2>Registrar Treino</h2>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancelar' : '➕ Novo Registro'}
            </button>
          </div>

          {showForm && (
            <div className="progress-form-container">
              <form onSubmit={handleSubmit} className="progress-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="workout_date">Data do Treino *</label>
                    <input
                      type="date"
                      id="workout_date"
                      name="workout_date"
                      value={formData.workout_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="completed">Status</label>
                    <select
                      id="completed"
                      name="completed"
                      value={formData.completed ? 'true' : 'false'}
                      onChange={handleInputChange}
                    >
                      <option value="true">✓ Completo</option>
                      <option value="false">○ Incompleto</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Observações</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ex: Dificuldade no aquecimento, sentiram dores..."
                    rows={4}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Salvando...' : '✓ Registrar'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* Progress Logs Section */}
        <section className="progress-section">
          <h2>Histórico de Treinos</h2>

          {progressLogs.length === 0 ? (
            <div className="no-data">
              <p>📋 Nenhum registro de treino ainda</p>
              <p className="subtitle">Comece a registrar os treinos do aluno</p>
            </div>
          ) : (
            <div className="progress-logs">
              {progressLogs.map((log, index) => (
                <div
                  key={log.id}
                  className={`progress-log ${log.completed ? 'completed' : 'incomplete'}`}
                >
                  <div className="log-header">
                    <div className="log-date">
                      <span className="log-number">#{index + 1}</span>
                      <span className="log-date-text">
                        {new Date(log.workout_date).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className={`log-status ${log.completed ? 'success' : 'warning'}`}>
                      {log.completed ? '✓ Completo' : '○ Incompleto'}
                    </span>
                  </div>

                  {log.notes && (
                    <div className="log-notes">
                      <p>📝 {log.notes}</p>
                    </div>
                  )}

                  <div className="log-actions">
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(log.id)}
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

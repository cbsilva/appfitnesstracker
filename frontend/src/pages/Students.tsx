import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService, Student } from '../services/studentService';
import '../styles/Students.css';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    gender: 'M',
    modality: 'musculacao' as 'musculacao' | 'corrida' | 'ambos',
    medical_restrictions: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      setError('Erro ao buscar alunos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.name || !formData.password) {
      setError('Email, nome e senha são obrigatórios');
      return;
    }

    try {
      const newStudent = await studentService.createStudent({
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        role: 'student',
      } as any);

      setStudents([...students, newStudent]);
      setSuccess('Aluno criado com sucesso!');
      setFormData({
        email: '',
        name: '',
        password: '',
        age: '',
        weight: '',
        height: '',
        gender: 'M',
        modality: 'musculacao',
        medical_restrictions: '',
      });
      setShowForm(false);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar aluno');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este aluno?')) return;

    try {
      await studentService.deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
      setSuccess('Aluno deletado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao deletar aluno');
    }
  };

  if (loading) return <div className="loading">Carregando alunos...</div>;

  return (
    <div className="students-container">
      <header className="students-header">
        <h1>Meus Alunos</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancelar' : '+ Novo Aluno'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            ← Voltar ao Dashboard
          </button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Adicionar Novo Aluno</h2>
          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="aluno@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Nome *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="João Silva"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Senha *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Senha segura"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gênero</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Idade</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="25"
                  min="0"
                  max="120"
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
                  placeholder="75.5"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="height">Altura (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="180"
                  step="0.1"
                />
              </div>
            </div>

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
                  <option value="musculacao">Musculação</option>
                  <option value="corrida">Corrida</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="medical_restrictions">Restrições Médicas</label>
              <textarea
                id="medical_restrictions"
                name="medical_restrictions"
                value={formData.medical_restrictions}
                onChange={handleInputChange}
                placeholder="Descreva qualquer restrição médica (opcional)"
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                ✓ Criar Aluno
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="students-list">
        <h2>{students.length} Aluno(s) Cadastrado(s)</h2>
        {students.length === 0 ? (
          <p className="no-data">Nenhum aluno cadastrado ainda. Crie o seu primeiro aluno!</p>
        ) : (
          <div className="students-grid">
            {students.map((student) => (
              <div key={student.id} className="student-card">
                <div className="student-header">
                  <h3>{student.name}</h3>
                  <span className="badge" data-modality={student.modality}>
                    {student.modality === 'musculacao'
                      ? '💪 Musculação'
                      : student.modality === 'corrida'
                      ? '🏃 Corrida'
                      : '🏋️ Ambos'}
                  </span>
                </div>

                <p className="student-email">
                  <strong>📧</strong> {student.email}
                </p>

                {student.age && (
                  <p className="student-info">
                    <strong>👤</strong> {student.age} anos
                  </p>
                )}

                {student.weight && student.height && (
                  <p className="student-info">
                    <strong>⚖️</strong> {student.weight}kg | 📏 {student.height}cm
                  </p>
                )}

                {student.medical_restrictions && (
                  <p className="student-restrictions">
                    <strong>⚠️ Restrições:</strong> {student.medical_restrictions}
                  </p>
                )}

                <div className="student-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/training-plan/student/${student.id}`)}
                  >
                    Ver Planos
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => student.id && handleDelete(student.id)}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

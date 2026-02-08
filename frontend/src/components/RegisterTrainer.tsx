import React, { useState } from 'react';
import { authService } from '../services/authService';
import '../styles/RegisterTrainer.css';

interface RegisterTrainerProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterTrainer({ onClose, onSuccess }: RegisterTrainerProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validations
    if (!formData.email || !formData.name || !formData.password) {
      setError('Email, nome e senha são obrigatórios');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem');
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        role: 'trainer',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erro ao registrar novo treinador'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-trainer-overlay">
      <div className="register-trainer-modal">
        <div className="modal-header">
          <h2>Registrar Novo Treinador</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="trainer@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Nome Completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="João da Silva"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirme a senha"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Registrando...' : '✓ Registrar Treinador'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="info-box">
          <h4>ℹ️ Informações importantes</h4>
          <ul>
            <li>Cada treinador terá acesso apenas aos seus alunos</li>
            <li>A senha será usada para fazer login no sistema</li>
            <li>Certifique-se de que o email é válido e único</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

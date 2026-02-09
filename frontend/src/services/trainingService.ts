import api from './api';

export interface TrainingPlan {
  id: number;
  student_id: number;
  trainer_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  modality: 'musculacao' | 'corrida' | 'ambos';
  frequency: number;
  status: 'active' | 'paused' | 'completed';
}

export const trainingService = {
  getPlans: async (): Promise<TrainingPlan[]> => {
    const response = await api.get('/training-plans');
    return response.data;
  },

  getPlan: async (id: number): Promise<TrainingPlan> => {
    const response = await api.get(`/training-plans/${id}`);
    return response.data;
  },

  getPlanById: async (id: number): Promise<TrainingPlan> => {
    const response = await api.get(`/training-plans/${id}`);
    return response.data;
  },

  createPlan: async (data: Omit<TrainingPlan, 'id'>): Promise<TrainingPlan> => {
    const response = await api.post('/training-plans', data);
    return response.data;
  },

  updatePlan: async (id: number, data: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    const response = await api.put(`/training-plans/${id}`, data);
    return response.data;
  },

  deletePlan: async (id: number): Promise<void> => {
    await api.delete(`/training-plans/${id}`);
  },
};

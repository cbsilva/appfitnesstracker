import api from './api';

export interface Exercise {
  id: number;
  workout_id: number;
  name: string;
  series: number;
  reps: number;
  weight?: number;
  duration_seconds?: number;
  rest_seconds: number;
  notes?: string;
  order: number;
  equipment_type?: string;
  muscle_group?: string;
}

export interface Workout {
  id: number;
  training_plan_id: number;
  day_of_week: number;
  name: string;
  description?: string;
  duration_minutes: number;
  difficulty: string;
  modality?: string;
  created_at: string;
  exercises?: Exercise[];
}

export interface CreateWorkoutDTO {
  training_plan_id: number;
  day_of_week: number;
  name: string;
  description?: string;
  duration_minutes: number;
  difficulty: string;
  modality?: string;
}

export const workoutService = {
  createWorkout: async (data: CreateWorkoutDTO): Promise<Workout> => {
    const response = await api.post('/workouts', data);
    return response.data;
  },

  getWorkoutsByPlan: async (planId: number): Promise<Workout[]> => {
    const response = await api.get(`/workouts/plan/${planId}`);
    return response.data;
  },

  getWorkout: async (id: number): Promise<Workout> => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  updateWorkout: async (id: number, data: Partial<CreateWorkoutDTO>): Promise<Workout> => {
    const response = await api.put(`/workouts/${id}`, data);
    return response.data;
  },

  deleteWorkout: async (id: number): Promise<void> => {
    await api.delete(`/workouts/${id}`);
  },
};

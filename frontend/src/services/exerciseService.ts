import api from './api';

export interface CreateExerciseDTO {
  workout_id: number;
  name: string;
  series: number;
  reps?: number;
  weight?: number;
  duration_seconds?: number;
  rest_seconds: number;
  notes?: string;
  equipment_type?: string;
  muscle_group?: string;
  order: number;
}

export interface Exercise {
  id: number;
  workout_id: number;
  name: string;
  series: number;
  reps?: number;
  weight?: number;
  duration_seconds?: number;
  rest_seconds: number;
  notes?: string;
  equipment_type?: string;
  muscle_group?: string;
  order: number;
  created_at: string;
}

export const exerciseService = {
  createExercise: async (data: CreateExerciseDTO): Promise<Exercise> => {
    const response = await api.post('/exercises', data);
    return response.data;
  },

  getExercisesByWorkout: async (workoutId: number): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/workout/${workoutId}`);
    return response.data;
  },

  getExercise: async (id: number): Promise<Exercise> => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  updateExercise: async (id: number, data: Partial<CreateExerciseDTO>): Promise<Exercise> => {
    const response = await api.put(`/exercises/${id}`, data);
    return response.data;
  },

  deleteExercise: async (id: number): Promise<void> => {
    await api.delete(`/exercises/${id}`);
  },
};

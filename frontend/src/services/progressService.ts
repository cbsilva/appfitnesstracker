import api from './api';

export interface ProgressLog {
  id: number;
  student_id: number;
  workout_date: string;
  workout_id?: number;
  notes?: string;
  completed: boolean;
  created_at: string;
}

export interface CreateProgressDTO {
  student_id: number;
  workout_date: string;
  workout_id?: number;
  notes?: string;
  completed: boolean;
}

export interface ProgressStats {
  totalWorkouts: number;
  completedWorkouts: number;
  completionRate: number;
  lastWorkout?: string;
  averageWeight?: number;
  weightChange?: number;
}

export const progressService = {
  createProgress: async (data: CreateProgressDTO): Promise<ProgressLog> => {
    const response = await api.post('/progress', data);
    return response.data;
  },

  getProgressByStudent: async (studentId: number): Promise<ProgressLog[]> => {
    const response = await api.get(`/progress/student/${studentId}`);
    return response.data;
  },

  getProgress: async (id: number): Promise<ProgressLog> => {
    const response = await api.get(`/progress/${id}`);
    return response.data;
  },

  updateProgress: async (id: number, data: Partial<CreateProgressDTO>): Promise<ProgressLog> => {
    const response = await api.put(`/progress/${id}`, data);
    return response.data;
  },

  deleteProgress: async (id: number): Promise<void> => {
    await api.delete(`/progress/${id}`);
  },

  getProgressStats: async (studentId: number): Promise<ProgressStats> => {
    const logs = await progressService.getProgressByStudent(studentId);
    const totalWorkouts = logs.length;
    const completedWorkouts = logs.filter((log) => log.completed).length;

    return {
      totalWorkouts,
      completedWorkouts,
      completionRate: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0,
      lastWorkout: logs.length > 0 ? logs[0].workout_date : undefined,
    };
  },
};

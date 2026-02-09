import api from './api';

export interface Student {
  id?: number;
  user_id?: number;
  trainer_id?: number;
  email: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  modality: 'musculacao' | 'corrida' | 'ambos';
  medical_restrictions?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentUser extends Student {
  password: string;
  role: 'student';
}

export const studentService = {
  getStudents: async (): Promise<Student[]> => {
    const response = await api.get('/students');
    return response.data;
  },

  getStudentById: async (id: number): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  createStudent: async (data: StudentUser): Promise<Student> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  updateStudent: async (id: number, data: Partial<Student>): Promise<Student> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};

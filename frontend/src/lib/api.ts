import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для добавления токена аутентификации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Типы данных
export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Todo {
  id: number;
  task: string;
  completed: boolean;
  userId: number;
}

export interface Appeal {
  id: number;
  subject: string;
  description: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  solution?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

// API методы для аутентификации
export const auth = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (username: string, password: string) => {
    const response = await api.post('/auth/register', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// API методы для обращений
export const appeals = {
  getAll: async (params?: { date?: string; startDate?: string; endDate?: string }) => {
    const response = await api.get<Appeal[]>('/appeals', { params });
    return response.data;
  },
  create: async (subject: string, description: string) => {
    const response = await api.post<Appeal>('/appeals', { subject, description });
    return response.data;
  },
  process: async (id: number) => {
    const response = await api.patch<Appeal>(`/appeals/${id}/process`);
    return response.data;
  },
  complete: async (id: number, solution: string) => {
    const response = await api.patch<Appeal>(`/appeals/${id}/complete`, { solution });
    return response.data;
  },
  cancel: async (id: number, cancelReason: string) => {
    const response = await api.patch<Appeal>(`/appeals/${id}/cancel`, { cancelReason });
    return response.data;
  },
  cancelAllInProgress: async (cancelReason: string) => {
    const response = await api.patch('/appeals/cancel-all-in-progress', { cancelReason });
    return response.data;
  }
};

// API методы для задач (todos)
export const todos = {
  getAll: async () => {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },
  create: async (task: string) => {
    const response = await api.post<Todo>('/todos', { task });
    return response.data;
  },
  update: async (id: number, data: Partial<Todo>) => {
    const response = await api.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  }
};

export default api;
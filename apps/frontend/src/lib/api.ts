import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data: { email: string; name: string; password: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
};

// Tasks endpoints
export const tasksAPI = {
  create: (data: any) => apiClient.post('/tasks', data),
  getAll: (filters?: any) => apiClient.get('/tasks', { params: filters }),
  getById: (id: string) => apiClient.get(`/tasks/${id}`),
  update: (id: string, data: any) => apiClient.put(`/tasks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tasks/${id}`),
};

// Users endpoints
export const usersAPI = {
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (data: any) => apiClient.put('/users/me', data),
};

// Subtasks endpoints
export const subtasksAPI = {
  getAll: (taskId: string) => apiClient.get(`/tasks/${taskId}/subtasks`),
  create: (taskId: string, data: any) =>
    apiClient.post(`/tasks/${taskId}/subtasks`, data),
  update: (taskId: string, subtaskId: string, data: any) =>
    apiClient.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, data),
  delete: (taskId: string, subtaskId: string) =>
    apiClient.delete(`/tasks/${taskId}/subtasks/${subtaskId}`),
  reorder: (taskId: string, subtaskIds: string[]) =>
    apiClient.post(`/tasks/${taskId}/subtasks/reorder`, { subtaskIds }),
};

// Notifications endpoints
export const notificationsAPI = {
  getPending: () => apiClient.get('/notifications/pending'),
  checkUpcoming: () => apiClient.post('/notifications/check-upcoming'),
  resetNotification: (taskId: string) =>
    apiClient.post(`/notifications/reset/${taskId}`),
};

// Analytics endpoints
export const analyticsAPI = {
  getProductivity: () => apiClient.get('/tasks/analytics/productivity'),
};

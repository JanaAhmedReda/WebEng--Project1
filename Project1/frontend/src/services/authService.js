import api from './api';

export const authService = {
  login: async (credentials) => (await api.post('/auth/login', credentials)).data,
  register: async (userData) => (await api.post('/auth/register', userData)).data,
  me: async () => (await api.get('/auth/me')).data,
  updateProfile: async (payload) => (await api.put('/auth/me', payload)).data,
  deleteAccount: async () => (await api.delete('/auth/me')).data,
  changePassword: async (payload) => (await api.post('/auth/change-password', payload)).data,
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
  },
  verifySession: async () => {
    await api.get('/pets');
    return true;
  },
};
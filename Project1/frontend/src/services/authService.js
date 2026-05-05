import api from './api';

export const authService = {
  login: async (credentials) => (await api.post('/auth/login', credentials)).data,
  register: async (userData) => (await api.post('/auth/register', userData)).data,
  me: async () => (await api.get('/auth/me')).data,
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
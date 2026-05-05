import axios from 'axios';

// Use relative '/api' in development so Vite proxy forwards requests to the backend
// When building for production, set VITE_API_BASE_URL to the full backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Log requests and responses for easier debugging in the browser
api.interceptors.request.use((config) => {
  console.debug('API Request:', config.method?.toUpperCase(), config.url, config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.debug('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error?.message, error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);

export default api;
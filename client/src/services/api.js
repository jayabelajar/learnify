import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('learnify-auth') || 'null');
  if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me')
};

export const courseApi = {
  list: (params) => api.get('/courses', { params }),
  get: (id) => api.get(`/courses/${id}`),
  create: (payload) => api.post('/courses', payload),
  update: (id, payload) => api.put(`/courses/${id}`, payload),
  remove: (id) => api.delete(`/courses/${id}`),
  publish: (id) => api.patch(`/courses/${id}/publish`)
};

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

export const moduleApi = {
  create: (courseId, payload) => api.post(`/courses/${courseId}/modules`, payload),
  update: (id, payload) => api.put(`/modules/${id}`, payload),
  remove: (id) => api.delete(`/modules/${id}`)
};

export const lessonApi = {
  create: (moduleId, payload) => api.post(`/modules/${moduleId}/lessons`, payload),
  update: (id, payload) => api.put(`/lessons/${id}`, payload),
  remove: (id) => api.delete(`/lessons/${id}`)
};

export const enrollmentApi = {
  myCourses: () => api.get('/enrollments/my-courses'),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  completeLesson: (courseId, lessonId) => api.patch(`/enrollments/${courseId}/lessons/${lessonId}/complete`)
};

export const userApi = {
  list: () => api.get('/users'),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  remove: (id) => api.delete(`/users/${id}`)
};

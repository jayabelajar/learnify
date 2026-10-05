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
  list: () => api.get('/enrollments'),
  myCourses: () => api.get('/enrollments/my-courses'),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  completeLesson: (courseId, lessonId) => api.patch(`/enrollments/${courseId}/lessons/${lessonId}/complete`)
};

export const userApi = {
  list: () => api.get('/users'),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  remove: (id) => api.delete(`/users/${id}`)
};

export const platformApi = {
  categories: () => api.get('/platform/categories'),
  createCategory: (payload) => api.post('/platform/categories', payload),
  updateCategory: (id, payload) => api.put(`/platform/categories/${id}`, payload),
  deleteCategory: (id) => api.delete(`/platform/categories/${id}`),
  assignments: () => api.get('/platform/assignments'),
  createAssignment: (payload) => api.post('/platform/assignments', payload),
  updateAssignment: (id, payload) => api.put(`/platform/assignments/${id}`, payload),
  deleteAssignment: (id) => api.delete(`/platform/assignments/${id}`),
  submissions: () => api.get('/platform/submissions'),
  createSubmission: (payload) => api.post('/platform/submissions', payload),
  reviewSubmission: (id, payload) => api.patch(`/platform/submissions/${id}/review`, payload),
  certificates: () => api.get('/platform/certificates'),
  discussions: () => api.get('/platform/discussions'),
  announcements: () => api.get('/platform/announcements'),
  createAnnouncement: (payload) => api.post('/platform/announcements', payload),
  updateAnnouncement: (id, payload) => api.put(`/platform/announcements/${id}`, payload),
  deleteAnnouncement: (id) => api.delete(`/platform/announcements/${id}`),
  reviews: () => api.get('/platform/reviews'),
  moderateReview: (id, payload) => api.patch(`/platform/reviews/${id}/moderate`, payload),
  auditLogs: () => api.get('/platform/audit-logs'),
  deleteAuditLog: (id) => api.delete(`/platform/audit-logs/${id}`),
  quizzes: () => api.get('/quizzes'),
  createQuiz: (courseId, payload) => api.post(`/courses/${courseId}/quizzes`, payload),
  updateQuiz: (id, payload) => api.put(`/quizzes/${id}`, payload),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`)
};

export const uploadApi = {
  file: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
};

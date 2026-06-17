import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

const client = axios.create({
  baseURL,
});

// Automatically add JWT token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('stc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper to format responses
const responseBody = (response: any) => response.data;

export const api = {
  auth: {
    login: (body: any) => client.post('/auth/login', body).then(responseBody),
    me: () => client.get('/auth/me').then(responseBody),
  },
  students: {
    list: (params: string = '') => client.get(`/students${params}`).then(responseBody),
    get: (id: number) => client.get(`/students/${id}`).then(responseBody),
    create: (formData: FormData) => client.post('/students', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(responseBody),
    update: (id: number, formData: FormData) => client.put(`/students/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(responseBody),
    delete: (id: number) => client.delete(`/students/${id}`).then(responseBody),
  },
  teachers: {
    list: (params: string = '') => client.get(`/teachers${params}`).then(responseBody),
    get: (id: number) => client.get(`/teachers/${id}`).then(responseBody),
    create: (formData: FormData) => client.post('/teachers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(responseBody),
    update: (id: number, formData: FormData) => client.put(`/teachers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(responseBody),
    delete: (id: number) => client.delete(`/teachers/${id}`).then(responseBody),
  },
  batches: {
    list: () => client.get('/batches').then(responseBody),
    get: (id: number) => client.get(`/batches/${id}`).then(responseBody),
    create: (body: any) => client.post('/batches', body).then(responseBody),
    update: (id: number, body: any) => client.put(`/batches/${id}`, body).then(responseBody),
    delete: (id: number) => client.delete(`/batches/${id}`).then(responseBody),
  },
  attendance: {
    history: (params: string = '') => client.get(`/attendance/history${params}`).then(responseBody),
    bulkMark: (body: any) => client.post('/attendance/bulk', body).then(responseBody),
  },
  payments: {
    studentList: (params: string = '') => client.get(`/payments/student${params}`).then(responseBody),
    createStudentPayment: (body: any) => client.post('/payments/student', body).then(responseBody),
    deleteStudentPayment: (id: number) => client.delete(`/payments/student/${id}`).then(responseBody),
    teacherList: (params: string = '') => client.get(`/payments/teacher${params}`).then(responseBody),
    createTeacherPayment: (body: any) => client.post('/payments/teacher', body).then(responseBody),
    pendingList: () => client.get('/payments/pending').then(responseBody),
  },
  reports: {
    dashboard: () => client.get('/reports/dashboard').then(responseBody),
  },
  settings: {
    get: () => client.get('/settings').then(responseBody),
    update: (body: any) => client.put('/settings', body).then(responseBody),
    backupUrl: `${baseURL}/settings/backup`,
    restore: (body: any) => client.post('/settings/restore', body).then(responseBody),
    reset: () => client.post('/settings/reset').then(responseBody),
    logs: () => client.get('/settings/logs').then(responseBody),
    clearLogs: () => client.post('/settings/logs/clear').then(responseBody),
  }
};

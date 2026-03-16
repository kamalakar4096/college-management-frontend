import api from '../utils/axios'

export const courseService = {
  getAll: () => api.get('/courses').then(r => r.data),
  getById: (id) => api.get(`/courses/${id}`).then(r => r.data),
  getByDepartment: (deptId) => api.get(`/courses/department/${deptId}`).then(r => r.data),
  create: (data) => api.post('/courses', data).then(r => r.data),
  update: (id, data) => api.put(`/courses/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/courses/${id}`).then(r => r.data),
}

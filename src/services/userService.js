import api from '../utils/axios'

export const userService = {
  getAll: () => api.get('/users').then(r => r.data),
  getById: (id) => api.get(`/users/${id}`).then(r => r.data),
  getByRole: (role) => api.get(`/users/role/${role}`).then(r => r.data),
  getByDepartment: (deptId) => api.get(`/users/department/${deptId}`).then(r => r.data),
  create: (data) => api.post('/users', data).then(r => r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(r => r.data),
  deactivate: (id) => api.put(`/users/${id}/deactivate`).then(r => r.data),
  activate: (id) => api.put(`/users/${id}/activate`).then(r => r.data),
}

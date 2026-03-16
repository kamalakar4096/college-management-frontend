import api from '../utils/axios'

export const departmentService = {
  getAll: () => api.get('/departments').then(r => r.data),
  getById: (id) => api.get(`/departments/${id}`).then(r => r.data),
  create: (data) => api.post('/departments', data).then(r => r.data),
  update: (id, data) => api.put(`/departments/${id}`, data).then(r => r.data),
  assignHod: (deptId, hodId) => api.put(`/departments/${deptId}/assign-hod/${hodId}`).then(r => r.data),
}

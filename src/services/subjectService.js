import api from '../utils/axios'

export const subjectService = {
  getAll: () => api.get('/subjects').then(r => r.data),
  getById: (id) => api.get(`/subjects/${id}`).then(r => r.data),
  getByDepartment: (deptId) => api.get(`/subjects/department/${deptId}`).then(r => r.data),
  getByFaculty: (facultyId) => api.get(`/subjects/faculty/${facultyId}`).then(r => r.data),
  create: (data) => api.post('/subjects', data).then(r => r.data),
  update: (id, data) => api.put(`/subjects/${id}`, data).then(r => r.data),
  assignFaculty: (subjectId, facultyId) => api.put(`/subjects/${subjectId}/assign-faculty/${facultyId}`).then(r => r.data),
}

import api from '../utils/axios'
import axios from '../utils/axios'

export const assignmentService = {
  create: (formData) => api.post('/assignments', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  getById: (id) => api.get(`/assignments/${id}`).then(r => r.data),
  getByFaculty: (facultyId) => api.get(`/assignments/faculty/${facultyId}`).then(r => r.data),
  getBySubject: (subjectId) => api.get(`/assignments/subject/${subjectId}`).then(r => r.data),
  submit: (id, formData) => api.post(`/assignments/${id}/submit`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  getSubmissions: (id) => api.get(`/assignments/${id}/submissions`).then(r => r.data),
  getMySubmission: (id) => api.get(`/assignments/${id}/my-submission`).then(r => r.data),
}

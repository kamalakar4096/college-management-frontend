import api from '../utils/axios'

export const marksService = {
  add: (data) => api.post('/marks', data).then(r => r.data),
  update: (id, data) => api.put(`/marks/${id}`, data).then(r => r.data),
  getByStudent: (studentId) => api.get(`/marks/student/${studentId}`).then(r => r.data),
  getByStudentAndSubject: (studentId, subjectId) => api.get(`/marks/student/${studentId}/subject/${subjectId}`).then(r => r.data),
}

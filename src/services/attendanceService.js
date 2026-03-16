import api from '../utils/axios'

export const attendanceService = {
  mark: (data) => api.post('/attendance', data).then(r => r.data),
  update: (id, status) => api.put(`/attendance/${id}?status=${status}`).then(r => r.data),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`).then(r => r.data),
  getBySubjectAndDate: (subjectId, date) => api.get(`/attendance/subject/${subjectId}?date=${date}`).then(r => r.data),
  getPercentage: (studentId, subjectId) => api.get(`/attendance/percentage?studentId=${studentId}&subjectId=${subjectId}`).then(r => r.data),
}

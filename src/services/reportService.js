import api from '../utils/axios'

export const reportService = {
  getSummary: () => api.get('/reports/summary').then(r => r.data),
  getDepartmentStats: (id) => api.get(`/reports/department/${id}`).then(r => r.data),
}

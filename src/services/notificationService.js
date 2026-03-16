import api from '../utils/axios'

export const notificationService = {
  send: (data) => api.post('/notifications', data).then(r => r.data),
  getForMyRole: () => api.get('/notifications/my-role').then(r => r.data),
  getSent: () => api.get('/notifications/sent').then(r => r.data),
}

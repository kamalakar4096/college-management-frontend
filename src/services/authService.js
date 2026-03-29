import api from '../utils/axios'

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    return res
  },
}
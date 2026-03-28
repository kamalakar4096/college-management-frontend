import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('REQUEST:', config.url, 'TOKEN:', token ? 'exists' : 'MISSING')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('API ERROR:', error.config?.url, error.response?.status, JSON.stringify(error.response?.data))
    return Promise.reject(error.response?.data || error)
  }
)

export default api
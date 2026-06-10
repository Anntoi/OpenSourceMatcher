import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Validate API URL on startup
if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is not configured')
}

const token = localStorage.getItem('osm_token')

const api = axios.create({
  baseURL: API_URL,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
})

export const setAuthToken = (value) => {
  if (!value) {
    delete api.defaults.headers.Authorization
    localStorage.removeItem('osm_token')
    return
  }

  api.defaults.headers.Authorization = `Bearer ${value}`
  localStorage.setItem('osm_token', value)
}

// Interceptor for 401 responses (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      setAuthToken(null)
      // Dispatch custom event that AuthContext can listen to
      window.dispatchEvent(new CustomEvent('token-expired'))
    }
    return Promise.reject(error)
  }
)

export default api


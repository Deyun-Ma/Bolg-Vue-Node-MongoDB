import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:5000' : '/'
})

// Add token to all requests if it exists in localStorage
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Add interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
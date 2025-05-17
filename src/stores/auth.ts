import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '../services/api'

export interface User {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.isAdmin || false)

  // Check if user is already logged in (from localStorage)
  function checkAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      
      // Set authorization header for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  // Register a new user
  async function register(name: string, email: string, password: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/auth/register', { name, email, password })
      
      // Save token and user data
      token.value = response.data.token
      user.value = response.data.user
      
      // Save to localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      // Set authorization header for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      router.push('/')
      return true
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Registration failed'
      } else {
        error.value = 'An unexpected error occurred'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Login user
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/auth/login', { email, password })
      
      // Save token and user data
      token.value = response.data.token
      user.value = response.data.user
      
      // Save to localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      // Set authorization header for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      router.push('/')
      return true
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Login failed'
      } else {
        error.value = 'An unexpected error occurred'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout user
  function logout() {
    user.value = null
    token.value = null
    
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Remove authorization header
    delete api.defaults.headers.common['Authorization']
    
    router.push('/login')
  }

  // Update user profile
  async function updateProfile(userData: Partial<User>) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/api/users/profile', userData)
      
      // Update user data
      user.value = response.data
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return true
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Profile update failed'
      } else {
        error.value = 'An unexpected error occurred'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    checkAuth,
    register,
    login,
    logout,
    updateProfile
  }
})
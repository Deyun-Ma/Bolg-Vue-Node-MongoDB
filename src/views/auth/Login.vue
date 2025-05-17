<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  if (isSubmitting.value) return
  
  errorMessage.value = ''
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }
  
  isSubmitting.value = true
  
  try {
    const success = await authStore.login(email.value, password.value)
    
    if (!success && authStore.error) {
      errorMessage.value = authStore.error
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Or
          <router-link to="/register" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            create a new account
          </router-link>
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="errorMessage" class="bg-error-50 text-error-700 p-4 rounded-md text-sm mb-4">
          {{ errorMessage }}
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="input"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="input"
            placeholder="••••••••"
          />
        </div>
        
        <div>
          <button
            type="submit"
            class="btn btn-primary w-full flex items-center justify-center"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="mr-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
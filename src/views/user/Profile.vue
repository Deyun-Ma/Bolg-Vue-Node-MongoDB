<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const { user, updateProfile, loading, error } = authStore

const name = ref(user?.name || '')
const email = ref(user?.email || '')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const isSubmitting = computed(() => loading)

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Basic validation
  if (!name.value) {
    errorMessage.value = 'Name is required'
    return
  }
  
  // Check if passwords match when changing password
  if (newPassword.value || confirmPassword.value) {
    if (!currentPassword.value) {
      errorMessage.value = 'Current password is required to set a new password'
      return
    }
    
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'New passwords do not match'
      return
    }
    
    if (newPassword.value.length < 6) {
      errorMessage.value = 'New password must be at least 6 characters'
      return
    }
  }
  
  // Prepare data to update
  const userData: any = {
    name: name.value
  }
  
  if (newPassword.value) {
    userData.currentPassword = currentPassword.value
    userData.newPassword = newPassword.value
  }
  
  const success = await updateProfile(userData)
  
  if (success) {
    successMessage.value = 'Profile updated successfully'
    
    // Clear password fields after successful update
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } else if (error.value) {
    errorMessage.value = error.value
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 md:p-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Profile</h1>
        
        <div v-if="successMessage" class="bg-success-50 text-success-700 p-4 rounded-md text-sm mb-6">
          {{ successMessage }}
        </div>
        
        <div v-if="errorMessage" class="bg-error-50 text-error-700 p-4 rounded-md text-sm mb-6">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                v-model="name"
                required
                class="input"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                v-model="email"
                disabled
                class="input bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>
            
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
              
              <div class="space-y-4">
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    v-model="currentPassword"
                    class="input"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    v-model="newPassword"
                    class="input"
                    placeholder="Enter your new password"
                  />
                </div>
                
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    v-model="confirmPassword"
                    class="input"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>
            </div>
            
            <div class="flex justify-end pt-4">
              <button
                type="submit"
                class="btn btn-primary flex items-center"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Page Not Found</h2>
      <p class="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button 
          @click="goBack"
          class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300"
        >
          Go Back
        </button>
        <router-link 
          to="/" 
          class="btn btn-primary"
        >
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>
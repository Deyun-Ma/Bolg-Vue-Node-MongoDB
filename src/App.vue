<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Check if user is logged in (from localStorage)
  authStore.checkAuth()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <main class="flex-grow">
      <!-- Page transition -->
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Footer />
  </div>
</template>
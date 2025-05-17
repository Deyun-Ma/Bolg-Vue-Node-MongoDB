<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

const isLoggedIn = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handleLogout() {
  authStore.logout()
  closeMenu()
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              BlogMaster
            </router-link>
          </div>
          
          <!-- Desktop navigation -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link 
              to="/" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[$route.path === '/' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200']"
            >
              Home
            </router-link>
            
            <router-link 
              to="/posts" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[$route.path.startsWith('/posts') && $route.name !== 'CreatePost' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200']"
            >
              Blog
            </router-link>
            
            <router-link 
              v-if="isLoggedIn"
              to="/create-post" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[$route.name === 'CreatePost' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200']"
            >
              Create Post
            </router-link>
            
            <router-link 
              v-if="isAdmin"
              to="/dashboard" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[$route.path === '/dashboard' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200']"
            >
              Dashboard
            </router-link>
          </div>
        </div>
        
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div v-if="isLoggedIn" class="ml-3 relative">
            <div>
              <button 
                type="button" 
                class="max-w-xs bg-white dark:bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                id="user-menu-button"
                @click="toggleMenu"
              >
                <span class="sr-only">Open user menu</span>
                <span class="h-8 w-8 rounded-full bg-primary-200 dark:bg-primary-600 flex items-center justify-center text-primary-700 dark:text-primary-100 uppercase">
                  {{ user?.name?.charAt(0) || 'U' }}
                </span>
              </button>
            </div>
            
            <div 
              v-if="isMenuOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                tabindex="-1"
                @click="closeMenu"
              >
                Your Profile
              </router-link>
              
              <button 
                type="button"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                tabindex="-1"
                @click="handleLogout"
              >
                Sign out
              </button>
            </div>
          </div>
          
          <div v-else class="flex items-center space-x-4">
            <router-link 
              to="/login" 
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              Log in
            </router-link>
            
            <router-link 
              to="/register" 
              class="btn btn-primary text-sm"
            >
              Register
            </router-link>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button 
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            @click="toggleMenu"
          >
            <span class="sr-only">Open main menu</span>
            <svg 
              v-if="!isMenuOpen" 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              v-else 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link 
          to="/" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.path === '/' ? 'border-primary-500 text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-gray-700' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
          @click="closeMenu"
        >
          Home
        </router-link>
        
        <router-link 
          to="/posts" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.path.startsWith('/posts') && $route.name !== 'CreatePost' ? 'border-primary-500 text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-gray-700' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
          @click="closeMenu"
        >
          Blog
        </router-link>
        
        <router-link 
          v-if="isLoggedIn"
          to="/create-post" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.name === 'CreatePost' ? 'border-primary-500 text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-gray-700' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
          @click="closeMenu"
        >
          Create Post
        </router-link>
        
        <router-link 
          v-if="isAdmin"
          to="/dashboard" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.path === '/dashboard' ? 'border-primary-500 text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-gray-700' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
          @click="closeMenu"
        >
          Dashboard
        </router-link>
      </div>
      
      <div v-if="isLoggedIn" class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <span class="h-10 w-10 rounded-full bg-primary-200 dark:bg-primary-600 flex items-center justify-center text-primary-700 dark:text-primary-100 uppercase">
              {{ user?.name?.charAt(0) || 'U' }}
            </span>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800 dark:text-white">{{ user?.name }}</div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ user?.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <router-link 
            to="/profile" 
            class="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="closeMenu"
          >
            Your Profile
          </router-link>
          
          <button 
            type="button"
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="handleLogout"
          >
            Sign out
          </button>
        </div>
      </div>
      
      <div v-else class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
        <div class="space-y-1">
          <router-link 
            to="/login" 
            class="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="closeMenu"
          >
            Log in
          </router-link>
          
          <router-link 
            to="/register" 
            class="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="closeMenu"
          >
            Register
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
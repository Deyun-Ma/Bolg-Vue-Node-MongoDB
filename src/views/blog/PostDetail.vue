<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '../../stores/post'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const authStore = useAuthStore()
const { fetchPostById, post, loading, deletePost } = postStore

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const postId = computed(() => route.params.id as string)

const isAuthor = computed(() => {
  if (!post.value || !authStore.user) return false
  return post.value.author._id === authStore.user._id
})

const canEdit = computed(() => {
  return isAuthor.value || authStore.isAdmin
})

const formattedDate = computed(() => {
  if (!post.value) return ''
  
  const date = new Date(post.value.createdAt)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
})

onMounted(async () => {
  await fetchPostById(postId.value)
})

async function handleDelete() {
  if (isDeleting.value) return
  
  isDeleting.value = true
  
  try {
    const success = await deletePost(postId.value)
    
    if (success) {
      router.push('/posts')
    }
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else-if="!post" class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          The post you are looking for does not exist or has been removed.
        </p>
        <router-link to="/posts" class="btn btn-primary">
          Back to Posts
        </router-link>
      </div>
    </div>
    
    <div v-else class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div v-if="post.image" class="relative pb-[40%] bg-gray-200 dark:bg-gray-700">
          <img 
            :src="post.image" 
            :alt="post.title" 
            class="absolute top-0 left-0 w-full h-full object-cover"
          >
        </div>
        
        <div class="p-6 md:p-8">
          <div v-if="canEdit" class="flex justify-end mb-4 space-x-3">
            <router-link :to="`/edit-post/${post._id}`" class="btn btn-secondary text-sm">
              Edit Post
            </router-link>
            
            <button 
              @click="showDeleteConfirm = true"
              class="btn bg-error-500 text-white hover:bg-error-600 focus:ring-2 focus:ring-error-300 text-sm"
            >
              Delete
            </button>
          </div>
          
          <div class="mb-6">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full">
                {{ post.category || 'Uncategorized' }}
              </span>
            </div>
            
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ post.title }}
            </h1>
            
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-2">
                <div class="h-8 w-8 rounded-full bg-primary-200 dark:bg-primary-600 flex items-center justify-center text-primary-700 dark:text-primary-100 uppercase">
                  {{ post.author.name.charAt(0) }}
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ post.author.name }}</span>
              </div>
              
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ formattedDate }}</span>
            </div>
          </div>
          
          <div class="prose dark:prose-invert max-w-none mb-8" v-html="post.content"></div>
          
          <div v-if="post.tags && post.tags.length > 0" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in post.tags" 
                :key="tag"
                class="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8">
        <router-link to="/posts" class="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Posts
        </router-link>
      </div>
    </div>
    
    <!-- Delete confirmation modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteConfirm = false"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 dark:bg-error-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-error-600 dark:text-error-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  Delete Post
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this post? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="handleDelete"
              :disabled="isDeleting"
            >
              <span v-if="isDeleting" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
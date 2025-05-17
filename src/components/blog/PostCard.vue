<script setup lang="ts">
import { computed } from 'vue'
import { Post } from '../../stores/post'

const props = defineProps<{
  post: Post
}>()

const formattedDate = computed(() => {
  const date = new Date(props.post.createdAt)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }).format(date)
})

const truncatedExcerpt = computed(() => {
  if (props.post.excerpt.length > 150) {
    return props.post.excerpt.substring(0, 150) + '...'
  }
  return props.post.excerpt
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div class="relative pb-[56.25%] bg-gray-200 dark:bg-gray-700">
      <img 
        v-if="post.image" 
        :src="post.image" 
        :alt="post.title" 
        class="absolute top-0 left-0 w-full h-full object-cover"
      >
      <div 
        v-else 
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    
    <div class="p-6">
      <div class="flex items-center space-x-2 mb-2">
        <span class="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full">
          {{ post.category || 'Uncategorized' }}
        </span>
      </div>
      
      <router-link :to="`/posts/${post._id}`">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          {{ post.title }}
        </h3>
      </router-link>
      
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        {{ truncatedExcerpt }}
      </p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="h-8 w-8 rounded-full bg-primary-200 dark:bg-primary-600 flex items-center justify-center text-primary-700 dark:text-primary-100 uppercase">
            {{ post.author.name.charAt(0) }}
          </div>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ post.author.name }}</span>
        </div>
        
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>
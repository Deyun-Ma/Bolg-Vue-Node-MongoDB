<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostStore } from '../../stores/post'
import PostCard from '../../components/blog/PostCard.vue'

const postStore = usePostStore()
const { fetchPosts, posts, loading, searchPosts } = postStore

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)

onMounted(async () => {
  await fetchPosts()
})

async function handleSearch() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    isSearching.value = false
    return
  }
  
  isSearching.value = true
  searchResults.value = await searchPosts(searchQuery.value)
  isSearching.value = false
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Blog Posts</h1>
      
      <div class="relative mb-8">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search posts..."
          class="input pr-12"
          @keyup.enter="handleSearch"
        />
        <button
          type="button"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-primary-500"
          @click="handleSearch"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="loading || isSearching" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else-if="searchQuery && searchResults.length === 0" class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p class="text-gray-600 dark:text-gray-300">No posts found matching your search query.</p>
        <button @click="searchQuery = ''" class="btn btn-primary mt-4">
          View All Posts
        </button>
      </div>
    </div>
    
    <div v-else-if="(searchQuery ? searchResults : posts).length === 0" class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p class="text-gray-600 dark:text-gray-300">No posts available yet. Be the first to create one!</p>
        <router-link to="/create-post" class="btn btn-primary mt-4 inline-block">
          Create Post
        </router-link>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PostCard 
        v-for="post in searchQuery ? searchResults : posts" 
        :key="post._id" 
        :post="post" 
      />
    </div>
  </div>
</template>
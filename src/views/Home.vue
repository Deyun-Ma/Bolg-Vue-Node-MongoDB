<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostStore } from '../stores/post'
import PostCard from '../components/blog/PostCard.vue'

const postStore = usePostStore()
const { fetchPosts, posts, loading } = postStore

onMounted(async () => {
  await fetchPosts()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero section -->
    <section class="bg-primary-600 dark:bg-primary-800 rounded-lg text-white px-6 py-12 mb-12">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Welcome to BlogMaster
        </h1>
        <p class="text-lg md:text-xl text-primary-100 mb-8">
          A beautiful blog management system where you can read and create amazing content
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <router-link to="/posts" class="btn px-6 py-3 bg-white text-primary-700 hover:bg-primary-50 transition-colors">
            View Blog Posts
          </router-link>
          <router-link to="/login" class="btn px-6 py-3 bg-primary-700 text-white hover:bg-primary-800 transition-colors">
            Get Started
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Recent posts section -->
    <section class="mb-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Recent Posts
        </h2>
        <router-link to="/posts" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
          View All
        </router-link>
      </div>
      
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="posts.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p class="text-gray-600 dark:text-gray-300">No posts available yet. Be the first to create one!</p>
        <router-link to="/create-post" class="btn btn-primary mt-4 inline-block">
          Create Post
        </router-link>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostCard 
          v-for="post in posts.slice(0, 6)" 
          :key="post._id" 
          :post="post" 
        />
      </div>
    </section>
    
    <!-- Features section -->
    <section class="mb-12">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Why Choose BlogMaster?
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="h-12 w-12 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Rich Text Editor</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Create beautiful posts with our intuitive rich text editor that supports formatting, lists, and more.
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="h-12 w-12 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure Authentication</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Your content is protected with our secure authentication system, ensuring only authorized users can make changes.
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="h-12 w-12 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Categories & Tags</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Organize your content with categories and tags to make it easy for readers to find related articles.
          </p>
        </div>
      </div>
    </section>
    
    <!-- CTA section -->
    <section class="bg-accent-500 dark:bg-accent-600 rounded-lg text-white px-6 py-12">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          Ready to Start Blogging?
        </h2>
        <p class="text-lg md:text-xl text-accent-100 mb-8">
          Join our community of writers and share your thoughts with the world.
        </p>
        <router-link to="/register" class="btn px-6 py-3 bg-white text-accent-600 hover:bg-accent-50 transition-colors inline-block">
          Create an Account
        </router-link>
      </div>
    </section>
  </div>
</template>
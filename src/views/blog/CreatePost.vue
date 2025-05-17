<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '../../stores/post'
import RichTextEditor from '../../components/common/RichTextEditor.vue'

const router = useRouter()
const postStore = usePostStore()
const { createPost, loading } = postStore

const title = ref('')
const content = ref('')
const excerpt = ref('')
const category = ref('')
const tags = ref('')
const image = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  
  if (!title.value || !content.value || !excerpt.value) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }
  
  const tagsArray = tags.value
    ? tags.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    : []
  
  const postData = {
    title: title.value,
    content: content.value,
    excerpt: excerpt.value,
    category: category.value,
    tags: tagsArray,
    image: image.value
  }
  
  const newPost = await createPost(postData)
  
  if (newPost) {
    router.push(`/posts/${newPost._id}`)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 md:p-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create a New Post</h1>
        
        <div v-if="errorMessage" class="bg-error-50 text-error-700 p-4 rounded-md text-sm mb-6">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span class="text-error-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                v-model="title"
                required
                class="input"
                placeholder="Enter post title"
              />
            </div>
            
            <div>
              <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Excerpt <span class="text-error-500">*</span>
              </label>
              <textarea
                id="excerpt"
                v-model="excerpt"
                rows="3"
                required
                class="input"
                placeholder="Brief summary of your post"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                A short summary that appears in post listings
              </p>
            </div>
            
            <div>
              <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content <span class="text-error-500">*</span>
              </label>
              <RichTextEditor v-model="content" placeholder="Write your post content..." />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  v-model="category"
                  class="input"
                  placeholder="E.g., Technology"
                />
              </div>
              
              <div>
                <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  v-model="tags"
                  class="input"
                  placeholder="E.g., web, design, coding"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Separate tags with commas
                </p>
              </div>
            </div>
            
            <div>
              <label for="image" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Featured Image URL
              </label>
              <input
                id="image"
                type="text"
                v-model="image"
                class="input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <router-link 
                to="/posts" 
                class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </router-link>
              
              <button
                type="submit"
                class="btn btn-primary flex items-center"
                :disabled="loading"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Publishing...' : 'Publish Post' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import api from '../services/api'

export interface Post {
  _id: string
  title: string
  content: string
  excerpt: string
  author: {
    _id: string
    name: string
  }
  category: string
  tags: string[]
  image?: string
  createdAt: string
  updatedAt: string
}

export interface PostInput {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  image?: string
}

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const post = ref<Post | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all posts
  async function fetchPosts() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/posts')
      posts.value = response.data
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Failed to fetch posts'
      } else {
        error.value = 'An unexpected error occurred'
      }
    } finally {
      loading.value = false
    }
  }

  // Get a single post by ID
  async function fetchPostById(id: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/api/posts/${id}`)
      post.value = response.data
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Failed to fetch post'
      } else {
        error.value = 'An unexpected error occurred'
      }
    } finally {
      loading.value = false
    }
  }

  // Create a new post
  async function createPost(postData: PostInput) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/posts', postData)
      // Add the new post to the posts array
      posts.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Failed to create post'
      } else {
        error.value = 'An unexpected error occurred'
      }
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing post
  async function updatePost(id: string, postData: PostInput) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/api/posts/${id}`, postData)
      
      // Update the post in the posts array
      const index = posts.value.findIndex(p => p._id === id)
      if (index !== -1) {
        posts.value[index] = response.data
      }
      
      // Update the current post if it's the one being edited
      if (post.value && post.value._id === id) {
        post.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Failed to update post'
      } else {
        error.value = 'An unexpected error occurred'
      }
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete a post
  async function deletePost(id: string) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/api/posts/${id}`)
      
      // Remove the post from the posts array
      posts.value = posts.value.filter(p => p._id !== id)
      
      // Clear the current post if it's the one being deleted
      if (post.value && post.value._id === id) {
        post.value = null
      }
      
      return true
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Failed to delete post'
      } else {
        error.value = 'An unexpected error occurred'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Search posts
  async function searchPosts(query: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/api/posts/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Search failed'
      } else {
        error.value = 'An unexpected error occurred'
      }
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    post,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    searchPosts
  }
})
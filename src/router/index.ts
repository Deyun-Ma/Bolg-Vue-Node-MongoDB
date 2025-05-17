import { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('../views/blog/Posts.vue')
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: () => import('../views/blog/PostDetail.vue')
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: () => import('../views/blog/CreatePost.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-post/:id',
    name: 'EditPost',
    component: () => import('../views/blog/EditPost.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/user/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

// Route guard for protected routes
routes.forEach(route => {
  const originalBeforeEnter = route.beforeEnter
  
  route.beforeEnter = (to, from, next) => {
    // Check if the route requires authentication
    if (to.meta.requiresAuth) {
      const token = localStorage.getItem('token')
      if (!token) {
        return next({ name: 'Login' })
      }
      
      // Check if the route requires admin privileges
      if (to.meta.requiresAdmin) {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.isAdmin) {
          return next({ name: 'Home' })
        }
      }
    }

    // Check if the route requires guest (non-authenticated) access
    if (to.meta.requiresGuest) {
      const token = localStorage.getItem('token')
      if (token) {
        return next({ name: 'Home' })
      }
    }
    
    if (originalBeforeEnter) {
      return originalBeforeEnter(to, from, next)
    }
    
    next()
  }
})

export default routes
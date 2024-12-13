// router/index.js - 路由配置文件

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/students',
    name: 'StudentList',
    component: () => import('@/views/StudentListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/students/new',
    name: 'StudentAdd',
    component: () => import('@/views/StudentAddView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/students/:id',
    name: 'StudentDetail',
    component: () => import('@/views/StudentDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/students/:id/edit',
    name: 'StudentEdit',
    component: () => import('@/views/StudentEditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Report',
    component: () => import('@/views/ReportView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminSettings',
    component: () => import('@/views/AdminSettingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/students'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫：处理身份验证
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 检查页面是否需要认证
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // 未登录时重定向到登录页，并记录原目标路径
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 已登录用户访问登录页时重定向到首页
  if (to.path === '/login' && userStore.isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router

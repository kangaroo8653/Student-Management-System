// stores/user.js - 用户状态管理

import { defineStore } from 'pinia'

// 用户状态存储
export const useUserStore = defineStore('user', {
  // 状态定义
  state: () => ({
    username: localStorage.getItem('username') || '',
    isAuthenticated: !!localStorage.getItem('username')
  }),

  // 计算属性
  getters: {
    // 获取用户名
    getUsername: state => state.username,

    // 判断是否已登录
    isLoggedIn: state => state.isAuthenticated
  },

  // 操作方法
  actions: {
    // 用户登录：保存用户信息
    login(username) {
      this.username = username
      this.isAuthenticated = true
      localStorage.setItem('username', username)
    },

    // 用户登出：清除用户信息
    logout() {
      this.username = ''
      this.isAuthenticated = false
      localStorage.removeItem('username')
    },

    // 检查登录状态
    checkAuth() {
      const username = localStorage.getItem('username')
      if (username) {
        this.username = username
        this.isAuthenticated = true
        return true
      }
      return false
    }
  }
})

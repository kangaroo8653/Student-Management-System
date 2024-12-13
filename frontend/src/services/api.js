// api.js - 后端接口服务

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例并配置
const api = axios.create({
  baseURL: '/api', // API 基础路径
  timeout: 10000 // 请求超时时间：10秒
})

// 响应拦截器：统一处理响应数据和错误
api.interceptors.response.use(
  response => response.data,
  error => {
    // 显示错误提示
    ElMessage.error(error.response?.data?.error || '请求失败')
    return Promise.reject(error)
  }
)

// 认证相关接口
export const authService = {
  // 用户登录
  login(credentials) {
    return api.post('/login', credentials)
  }
}

// 学生管理相关接口
export const studentService = {
  // 获取学生列表（支持分页和搜索）
  getStudents({ page = 1, per_page = 10, search = '' } = {}) {
    return api.get('/students', {
      params: { page, per_page, search }
    })
  },

  // 获取单个学生详情
  getStudent(id) {
    return api.get(`/students/${id}`)
  },

  // 创建新学生
  createStudent(data) {
    return api.post('/students', data)
  },

  // 更新学生信息
  updateStudent(id, data) {
    return api.put(`/students/${id}`, data)
  },

  // 删除学生
  deleteStudent(id) {
    return api.delete(`/students/${id}`)
  },

  // 获取统计数据
  getStatistics() {
    return api.get('/statistics')
  },

  // 数据库备份和恢复
  resetDatabase() {
    return api.post('/reset-database')
  },

  exportBackup() {
    return api.get('/backup')
  },

  importBackup(data) {
    return api.post('/restore', { backup: data })
  }
}

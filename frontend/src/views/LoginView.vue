<!-- LoginView.vue - 登录页面 -->
<template>
  <div
    class="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-50 to-indigo-50"
  >
    <!-- 登录卡片 -->
    <el-card
      class="w-[380px] !border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <!-- 标题区域 -->
      <template #header>
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-2 mb-2">
            <img src="/favicon.ico" alt="logo" class="w-8 h-8" />
            <h2 class="text-2xl font-bold text-gray-800">学生管理系统</h2>
          </div>
          <p class="text-gray-600">请登录您的账号</p>
        </div>
      </template>

      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        @submit.prevent="handleLogin"
        class="mt-2"
      >
        <!-- 用户名输入 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            :disabled="loading"
            @keyup.enter="focusPassword"
          />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input
            ref="passwordInput"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            :disabled="loading"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" class="w-full !mt-4">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 提示信息 -->
      <div class="text-center text-xs text-gray-400 mt-4">提示:用户名"admin",密码"password"</div>
    </el-card>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { User, Lock } from '@element-plus/icons-vue'
  import { authService } from '@/services/api'
  import { useUserStore } from '@/stores/user'

  // 组件实例
  const loginFormRef = ref(null)
  const passwordInput = ref(null)

  // 路由和状态
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()

  // 加载状态
  const loading = ref(false)

  // 表单数据
  const loginForm = reactive({
    username: '',
    password: ''
  })

  // 表单验证规则
  const loginRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码至少6个字符', trigger: 'blur' }
    ]
  }

  // 输入框焦点控制
  const focusPassword = () => {
    passwordInput.value?.input?.focus()
  }

  // 处理登录
  const handleLogin = async () => {
    if (!loginFormRef.value) return

    try {
      // 表单验证
      await loginFormRef.value.validate()

      // 开始登录
      loading.value = true
      const response = await authService.login({
        username: loginForm.username,
        password: loginForm.password
      })

      if (response.success) {
        // 登录成功处理
        userStore.login(loginForm.username)
        ElMessage.success('登录成功')

        // 跳转到目标页面或默认页面
        const redirectPath = route.query.redirect || '/students'
        router.push(redirectPath)
      } else {
        ElMessage.error(response.message || '登录失败')
      }
    } catch (error) {
      // 错误处理
      ElMessage.error(error.response?.data?.message || '登录失败')
    } finally {
      loading.value = false
    }
  }
</script>

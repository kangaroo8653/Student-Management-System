<!-- App.vue - 应用程序根组件 -->
<template>
  <div class="min-h-screen font-sans bg-gray-50 text-gray-800">
    <!-- 路由视图 - 根据当前路由显示对应组件 -->
    <router-view v-slot="{ Component }">
      <!-- 过渡动画包装器 -->
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import { onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'

  // 配置页面加载进度条
  NProgress.configure({
    showSpinner: false,
    easing: 'ease',
    speed: 400,
    minimum: 0.2
  })

  const router = useRouter()

  // 设置路由切换时的进度条
  onBeforeMount(() => {
    router.beforeEach(() => {
      NProgress.start()
    })

    router.afterEach(() => {
      NProgress.done()
    })
  })
</script>

<style>
  /* 基础样式设置 */
  html {
    scroll-behavior: smooth;
  }

  body {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  /* 文本选中样式 */
  ::selection {
    background-color: #409eff33;
    color: #409eff;
  }

  /* 交互元素样式 */
  input:focus,
  button:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid #409eff33;
    outline-offset: 2px;
  }

  /* 页面过渡动画 */
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.3s ease;
  }

  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #cbd5e1;
  }

  /* 进度条样式 */
  #nprogress .bar {
    background: #409eff !important;
    height: 3px !important;
  }

  /* Element Plus 组件样式优化 */
  .el-button {
    transition: all 0.2s ease !important;
  }

  .el-button:not(.is-disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .el-card {
    transition: all 0.3s ease !important;
  }

  .el-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }

  .el-table__row {
    transition: background-color 0.2s ease !important;
  }

  .el-table__row:hover > td {
    background-color: #f8fafc !important;
  }
</style>

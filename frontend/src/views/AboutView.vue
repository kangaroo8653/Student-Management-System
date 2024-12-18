<!-- AboutView.vue - 关于系统页面 -->
<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <el-card class="max-w-4xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      <!-- 页面标题 -->
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-700">关于系统</h2>
          <el-button type="primary" :icon="Back" @click="router.back()"> 返回 </el-button>
        </div>
      </template>

      <div class="space-y-6">
        <!-- 系统简介 -->
        <section class="text-gray-600">
          <h3 class="text-xl font-medium mb-4 text-gray-800">系统简介</h3>
          <p class="leading-relaxed">一个简单的学生信息管理系统。</p>
        </section>

        <!-- 功能模块展示 -->
        <section class="text-gray-600">
          <h3 class="text-xl font-medium mb-4 text-gray-800">功能模块</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover" class="text-center h-full">
                <template #header>
                  <el-icon class="text-2xl text-blue-500">
                    <User />
                  </el-icon>
                </template>
                <h4 class="font-medium mb-2">学生管理</h4>
                <p class="text-sm text-gray-500">支持学生信息的增删改查操作</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" class="text-center h-full">
                <template #header>
                  <el-icon class="text-2xl text-green-500">
                    <TrendCharts />
                  </el-icon>
                </template>
                <h4 class="font-medium mb-2">数据统计</h4>
                <p class="text-sm text-gray-500">提供学生数据的统计和分析功能</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" class="text-center h-full">
                <template #header>
                  <el-icon class="text-2xl text-orange-500">
                    <Setting />
                  </el-icon>
                </template>
                <h4 class="font-medium mb-2">系统管理</h4>
                <p class="text-sm text-gray-500">包含数据备份和系统设置功能</p>
              </el-card>
            </el-col>
          </el-row>
        </section>

        <!-- 技术栈说明 -->
        <section class="text-gray-600">
          <h3 class="text-xl font-medium mb-4 text-gray-800">技术栈</h3>
          <div class="space-y-4">
            <!-- 前端技术 -->
            <div>
              <h4 class="text-lg font-medium mb-2 text-gray-700">前端技术</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="核心框架">Vue 3</el-descriptions-item>
                <el-descriptions-item label="构建工具">Vite</el-descriptions-item>
                <el-descriptions-item label="UI框架">Element Plus</el-descriptions-item>
                <el-descriptions-item label="样式框架">Tailwind CSS</el-descriptions-item>
                <el-descriptions-item label="状态管理">Pinia</el-descriptions-item>
                <el-descriptions-item label="路由管理">Vue Router</el-descriptions-item>
                <el-descriptions-item label="图表工具">ECharts</el-descriptions-item>
                <el-descriptions-item label="开发工具">Prettier</el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 后端技术 -->
            <div>
              <h4 class="text-lg font-medium mb-2 text-gray-700">后端技术</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="Web框架">Flask 3.0.0+</el-descriptions-item>
                <el-descriptions-item label="ORM框架">SQLAlchemy 2.0.0+</el-descriptions-item>
                <el-descriptions-item label="数据库">SQLite</el-descriptions-item>
                <el-descriptions-item label="API风格">RESTful</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </section>
      </div>
    </el-card>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { Back, User, TrendCharts, Setting } from '@element-plus/icons-vue'

  // 路由实例
  const router = useRouter()
</script>

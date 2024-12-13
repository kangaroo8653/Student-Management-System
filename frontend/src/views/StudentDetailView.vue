<!-- StudentDetailView.vue - 学生详情页面 -->
<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <div class="max-w-md mx-auto">
      <!-- 学生信息卡片 -->
      <el-card v-loading="loading" class="shadow-md hover:shadow-lg transition-shadow duration-300">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-700">学生详情</h2>
            <el-button type="primary" :icon="Back" @click="router.back()"> 返回 </el-button>
          </div>
        </template>

        <!-- 无数据提示 -->
        <el-empty v-if="!loading && !student" description="未找到学生信息">
          <template #extra>
            <el-button @click="router.back()">返回列表</el-button>
          </template>
        </el-empty>

        <!-- 学生基本信息 -->
        <template v-if="student">
          <div class="space-y-4">
            <!-- 头像和姓名 -->
            <div class="text-center mb-6">
              <el-avatar :size="80" class="mb-2">
                {{ student.name?.charAt(0) }}
              </el-avatar>
              <h3 class="text-lg font-medium">{{ student.name }}</h3>
              <el-tag size="small" type="info" class="mt-2">ID: {{ student.id }}</el-tag>
            </div>

            <!-- 详细信息列表 -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-gray-600">
                <span>年龄：</span>
                <el-tag size="small" :type="getAgeTagType(student.age)">
                  {{ student.age }}岁
                </el-tag>
              </div>

              <div class="flex items-center justify-between text-gray-600">
                <span>年级：</span>
                <el-tag>{{ student.grade }}</el-tag>
              </div>

              <div class="flex items-center justify-between text-gray-600">
                <span>邮箱：</span>
                <el-button link type="primary" :icon="Message" @click="handleSendEmail">
                  {{ student.email }}
                </el-button>
              </div>
            </div>

            <el-divider />

            <!-- 操作按钮 -->
            <div class="flex justify-end gap-3">
              <el-button type="primary" :icon="Edit" @click="handleEdit"> 编辑 </el-button>
              <el-popconfirm
                title="确定要删除这名学生吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDelete"
              >
                <template #reference>
                  <el-button type="danger" :icon="Delete" :loading="deleteLoading">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { Back, Edit, Delete, Message } from '@element-plus/icons-vue'
  import { studentService } from '@/services/api'

  // 路由和组件实例
  const route = useRoute()
  const router = useRouter()
  const studentId = route.params.id

  // 页面状态
  const student = ref(null)
  const loading = ref(false)
  const deleteLoading = ref(false)

  // 获取学生详情
  const fetchStudentDetails = async () => {
    loading.value = true
    try {
      const response = await studentService.getStudent(studentId)
      student.value = response
    } catch (error) {
      ElMessage.error('获取学生信息失败：' + error.message)
      router.back()
    } finally {
      loading.value = false
    }
  }

  // 根据年龄返回标签类型
  const getAgeTagType = age => {
    if (age < 7) return 'info'
    if (age < 9) return 'success'
    if (age < 11) return 'warning'
    return 'danger'
  }

  // 页面操作方法
  const handleEdit = () => {
    router.push(`/students/${studentId}/edit`)
  }

  const handleSendEmail = () => {
    if (student.value?.email) {
      window.location.href = `mailto:${student.value.email}`
    }
  }

  const handleDelete = async () => {
    deleteLoading.value = true
    try {
      await studentService.deleteStudent(studentId)
      ElMessage.success('删除成功')
      router.replace('/students')
    } catch (error) {
      ElMessage.error('删除失败：' + error.message)
    } finally {
      deleteLoading.value = false
    }
  }

  // 页面初始化
  onMounted(fetchStudentDetails)
</script>

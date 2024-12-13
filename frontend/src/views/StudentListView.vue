<!-- StudentListView.vue - 学生列表页面 -->
<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <el-card class="shadow-md hover:shadow-lg transition-shadow duration-300">
      <!-- 头部工具栏 -->
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <img src="/favicon.ico" alt="logo" class="w-6 h-6" />
            <div class="text-lg font-medium text-gray-700">学生管理系统</div>
          </div>
          <div class="flex gap-4">
            <!-- 学生操作按钮 -->
            <el-button-group>
              <el-button type="primary" :icon="Plus" @click="goToAddStudent"> 添加学生 </el-button>
              <el-button
                type="danger"
                :icon="Delete"
                :disabled="!selectedStudents.length"
                @click="handleBatchDelete"
              >
                批量删除
              </el-button>
            </el-button-group>

            <!-- 系统功能按钮 -->
            <el-button-group>
              <el-button type="success" :icon="TrendCharts" @click="goToReports">
                统计报表
              </el-button>
              <el-button type="warning" :icon="Setting" @click="goToAdminSettings">
                系统设置
              </el-button>
              <el-button type="info" :icon="InfoFilled" @click="goToAbout"> 关于系统 </el-button>
            </el-button-group>

            <!-- 退出登录按钮 -->
            <el-button type="danger" :icon="SwitchButton" @click="handleLogout">
              退出登录
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="mb-4">
        <el-input
          v-model="searchQuery"
          placeholder="搜索学生姓名或邮箱..."
          :prefix-icon="Search"
          clearable
          @input="debouncedFetchStudents"
          @clear="fetchStudents"
        />
      </div>

      <!-- 学生数据表格 -->
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="students"
        stripe
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="name" label="姓名" min-width="120" sortable />
        <el-table-column prop="age" label="年龄" width="80" align="center" sortable />
        <el-table-column prop="grade" label="年级" width="120" align="center" sortable />
        <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="240" fixed="right" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                size="small"
                type="success"
                :icon="View"
                @click="viewStudentDetail(row.id)"
              >
                详情
              </el-button>
              <el-button size="small" type="primary" :icon="Edit" @click="editStudent(row.id)">
                编辑
              </el-button>
              <el-button size="small" type="danger" :icon="Delete" @click="deleteStudent(row.id)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器和用户信息 -->
      <div class="mt-4 flex justify-between items-center">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalStudents"
          :page-sizes="allowedPageSizes"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          background
        />
        <div class="text-sm text-gray-500">当前用户：{{ userStore.username }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    Delete,
    Plus,
    Edit,
    Search,
    InfoFilled,
    TrendCharts,
    Setting,
    SwitchButton,
    View
  } from '@element-plus/icons-vue'
  import { studentService } from '@/services/api'
  import { useDebounce } from '@/composables/useDebounce'
  import { useStudentOperations } from '@/composables/useStudentOperations'
  import { useUserStore } from '@/stores/user'

  // 路由和状态管理
  const router = useRouter()
  const userStore = useUserStore()

  // 表格相关状态
  const tableRef = ref(null)
  const students = ref([])
  const loading = ref(false)
  const selectedStudents = ref([])

  // 搜索和分页状态
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalStudents = ref(0)
  const allowedPageSizes = ref([10, 20, 50, 100])

  // 获取学生列表数据
  const fetchStudents = async () => {
    loading.value = true
    try {
      const params = {
        page: currentPage.value,
        per_page: pageSize.value,
        search: searchQuery.value.trim()
      }

      const response = await studentService.getStudents(params)

      students.value = response.students
      totalStudents.value = response.total
      currentPage.value = response.page
      pageSize.value = response.per_page

      if (response.allowed_page_sizes) {
        allowedPageSizes.value = response.allowed_page_sizes
      }
    } catch (error) {
      console.error('获取学生列表失败:', error)
      ElMessage.error('获取学生列表失败：' + (error.message || '未知错误'))
    } finally {
      loading.value = false
    }
  }

  // 搜索防抖处理
  const { debouncedFn: debouncedFetchStudents } = useDebounce(fetchStudents, 300)

  // 表格操作方法
  const { deleteStudent, handleBatchDelete } = useStudentOperations(
    students,
    fetchStudents,
    selectedStudents
  )

  // 表格选择处理
  const handleSelectionChange = selection => {
    selectedStudents.value = selection
  }

  // 分页处理
  const handleSizeChange = size => {
    pageSize.value = size
    currentPage.value = 1
    fetchStudents()
  }

  const handlePageChange = page => {
    currentPage.value = page
    fetchStudents()
  }

  // 页面导航
  const goToAddStudent = () => router.push('/students/new')
  const viewStudentDetail = id => router.push(`/students/${id}`)
  const editStudent = id => router.push(`/students/${id}/edit`)
  const goToReports = () => router.push('/reports')
  const goToAdminSettings = () => router.push('/admin')
  const goToAbout = () => router.push('/about')

  // 退出登录处理
  const handleLogout = () => {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        userStore.logout()
        router.push('/login')
        ElMessage.success('已退出登录')
      })
      .catch(() => {})
  }

  // 页面初始化
  onMounted(fetchStudents)
</script>

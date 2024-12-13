<!-- StudentEditView.vue - 学生编辑页面 -->
<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <el-card class="max-w-2xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-700">编辑学生</h2>
          <el-button type="primary" :icon="Back" @click="router.back()"> 返回 </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="right"
        status-icon
        @submit.prevent="handleSubmit"
        class="mt-4"
        v-loading="loading"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入学生姓名"
            clearable
            :maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="form.age"
            :min="1"
            :max="100"
            placeholder="请输入年龄"
            class="!w-[180px]"
          />
        </el-form-item>

        <el-form-item label="年级" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择年级" class="!w-[180px]" clearable>
            <el-option v-for="grade in grades" :key="grade" :label="grade" :value="grade" />
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱地址" clearable type="email" />
        </el-form-item>

        <el-form-item class="mt-8">
          <div class="flex justify-center gap-4">
            <el-button plain :icon="Close" @click="resetForm"> 重置 </el-button>
            <el-button type="primary" :loading="submitLoading" :icon="Check" native-type="submit">
              保存
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { Back, Check, Close } from '@element-plus/icons-vue'
  import { studentService } from '@/services/api'

  // 路由和组件实例
  const route = useRoute()
  const router = useRouter()
  const formRef = ref(null)

  // 加载状态
  const loading = ref(false)
  const submitLoading = ref(false)
  const studentId = route.params.id

  // 表单数据
  const form = reactive({
    name: '',
    age: null,
    grade: '',
    email: ''
  })

  // 年级选项
  const grades = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']

  // 表单验证规则
  const rules = {
    name: [
      { required: true, message: '请输入学生姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    age: [
      { required: true, message: '请输入年龄', trigger: 'blur' },
      { type: 'number', message: '年龄必须为数字', trigger: 'blur' }
    ],
    grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
    email: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  }

  // 获取学生信息
  const fetchStudentDetails = async () => {
    loading.value = true
    try {
      const response = await studentService.getStudent(studentId)
      Object.assign(form, response)
    } catch (error) {
      ElMessage.error('获取学生信息失败：' + error.message)
      router.back()
    } finally {
      loading.value = false
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      submitLoading.value = true

      await studentService.updateStudent(studentId, form)
      ElMessage.success('更新成功')
      router.back()
    } catch (error) {
      if (!error?.message?.includes('validation')) {
        ElMessage.error('更新失败：' + error.message)
      }
    } finally {
      submitLoading.value = false
    }
  }

  // 重置表单
  const resetForm = () => {
    formRef.value?.resetFields()
  }

  // 页面初始化
  onMounted(fetchStudentDetails)
</script>

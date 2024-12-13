<!-- AdminSettingsView.vue - 系统管理页面 -->
<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <el-card class="max-w-3xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-700">系统设置</h2>
          <el-button type="primary" :icon="Back" @click="router.back()"> 返回 </el-button>
        </div>
      </template>

      <div class="space-y-12">
        <!-- 数据备份 -->
        <section class="bg-gray-50 p-6 rounded-lg border">
          <h3 class="text-xl font-medium mb-6 text-gray-800 flex items-center gap-2">
            <el-icon class="text-blue-500 text-2xl"><Download /></el-icon>
            数据备份
          </h3>
          <div class="space-y-4">
            <div class="flex gap-4">
              <el-button
                type="primary"
                :icon="Download"
                :loading="exporting"
                size="large"
                @click="handleExport"
              >
                导出备份
              </el-button>
              <el-upload
                class="upload-demo"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleFileChange"
              >
                <el-button type="success" :icon="Upload" :loading="importing" size="large">
                  导入备份
                </el-button>
              </el-upload>
            </div>
            <p class="text-gray-500 text-sm">
              提示:导出的备份文件为JSON格式,可用于数据迁移或备份恢复
            </p>
          </div>
        </section>

        <!-- 数据管理 -->
        <section class="bg-gray-50 p-6 rounded-lg border">
          <h3 class="text-xl font-medium mb-6 text-gray-800 flex items-center gap-2">
            <el-icon class="text-red-500 text-2xl"><Delete /></el-icon>
            数据管理
          </h3>
          <div class="space-y-4">
            <el-button type="danger" :icon="Delete" size="large" @click="handleReset">
              重置数据库
            </el-button>
            <p class="text-gray-500 text-sm">
              警告：重置数据库将清空所有数据，此操作不可恢复，请谨慎操作
            </p>
          </div>
        </section>
      </div>
    </el-card>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Back, Download, Upload, Delete } from '@element-plus/icons-vue'
  import { studentService } from '@/services/api'

  // 路由实例
  const router = useRouter()

  // 加载状态
  const importing = ref(false)
  const exporting = ref(false)

  // 导出备份
  const handleExport = async () => {
    try {
      exporting.value = true
      const response = await studentService.exportBackup()

      // 创建并下载文件
      const data = JSON.stringify(response.backup, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      window.URL.revokeObjectURL(url)

      ElMessage.success('备份导出成功')
    } catch (error) {
      ElMessage.error('备份导出失败：' + error.message)
    } finally {
      exporting.value = false
    }
  }

  // 导入备份
  const handleFileChange = async file => {
    if (!file) return

    try {
      importing.value = true
      const reader = new FileReader()
      reader.onload = async e => {
        try {
          const data = JSON.parse(e.target.result)
          await studentService.importBackup(data)
          ElMessage.success('备份导入成功')
        } catch (error) {
          ElMessage.error('备份导入失败：' + error.message)
        } finally {
          importing.value = false
        }
      }
      reader.readAsText(file.raw)
    } catch (error) {
      ElMessage.error('文件读取失败')
      importing.value = false
    }
  }

  // 重置数据库
  const handleReset = () => {
    ElMessageBox.confirm('确定要重置数据库吗？此操作将清空所有数据且不可恢复！', '警告', {
      confirmButtonText: '确定重置',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          await studentService.resetDatabase()
          ElMessage.success('数据库重置成功')
        } catch (error) {
          ElMessage.error('数据库重置失败：' + error.message)
        }
      })
      .catch(() => {})
  }
</script>

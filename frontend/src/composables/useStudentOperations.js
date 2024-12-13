// useStudentOperations.js - 学生操作相关的组合式API
import { ElMessage, ElMessageBox } from 'element-plus'
import { studentService } from '@/services/api'

/**
 * 创建学生操作相关的方法
 * @param {Array} students - 学生列表数据
 * @param {Function} fetchStudents - 获取学生列表的方法
 * @param {Ref} selectedStudents - 选中的学生列表
 * @returns {Object} 包含删除学生相关的方法
 */
export function useStudentOperations(students, fetchStudents, selectedStudents) {
  /**
   * 删除单个学生
   * @param {number|string} id - 学生ID
   */
  const deleteStudent = async id => {
    try {
      // 删除确认
      await ElMessageBox.confirm('确定要删除这个学生吗?', '删除确认', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })

      // 执行删除操作
      await studentService.deleteStudent(id)
      ElMessage.success('删除成功')
      // 刷新学生列表
      await fetchStudents()
    } catch (error) {
      // 非取消操作的错误处理
      if (error !== 'cancel') {
        ElMessage.error('删除失败：' + (error.message || '未知错误'))
        console.error('删除学生失败:', error)
      }
    }
  }

  /**
   * 批量删除学生
   */
  const handleBatchDelete = async () => {
    // 检查是否有选中的学生
    if (!selectedStudents.value.length) return

    try {
      // 批量删除确认
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedStudents.value.length} 名学生吗?`,
        '批量删除确认',
        {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )

      // 并行执行所有删除操作
      await Promise.all(
        selectedStudents.value.map(student => studentService.deleteStudent(student.id))
      )

      ElMessage.success('批量删除成功')
      // 刷新学生列表
      await fetchStudents()
    } catch (error) {
      // 非取消操作的错误处理
      if (error !== 'cancel') {
        ElMessage.error('批量删除失败：' + (error.message || '未知错误'))
        console.error('批量删除学生失败:', error)
      }
    }
  }

  return {
    deleteStudent,
    handleBatchDelete
  }
}

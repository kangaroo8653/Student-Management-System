<!-- ReportView.vue - 统计报表页面 -->
<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <!-- 报表卡片 -->
    <el-card class="max-w-4xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      <!-- 卡片标题 -->
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-700">统计报表</h2>
          <el-button type="primary" :icon="Back" @click="router.back()"> 返回 </el-button>
        </div>
      </template>

      <!-- 加载状态 -->
      <div v-loading="loading">
        <!-- 数据概览 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <el-card shadow="hover" class="text-center">
            <h3 class="text-gray-500 mb-2">学生总数</h3>
            <p class="text-3xl font-bold text-blue-500">{{ statistics.total_students || 0 }}</p>
          </el-card>
          <el-card shadow="hover" class="text-center">
            <h3 class="text-gray-500 mb-2">平均年龄</h3>
            <p class="text-3xl font-bold text-green-500">
              {{ formatNumber(statistics.average_age) }}
            </p>
          </el-card>
        </div>

        <!-- 年级分布图表 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">年级分布</h3>
          <div class="h-[300px]" ref="gradeChartRef"></div>
        </div>

        <!-- 年龄分布图表 -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4">年龄分布</h3>
          <div class="h-[300px]" ref="ageChartRef"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { Back } from '@element-plus/icons-vue'
  import { studentService } from '@/services/api'
  import * as echarts from 'echarts'

  // 路由和组件实例
  const router = useRouter()
  const gradeChartRef = ref(null)
  const ageChartRef = ref(null)

  // 页面状态
  const loading = ref(false)
  const statistics = reactive({
    total_students: 0,
    average_age: 0,
    grade_distribution: {},
    students: []
  })

  // 图表实例
  let gradeChart = null
  let ageChart = null

  // 格式化数字
  const formatNumber = num => {
    return Number(num).toFixed(1)
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    loading.value = true
    try {
      const statsResponse = await studentService.getStatistics()
      Object.assign(statistics, statsResponse)

      const studentsResponse = await studentService.getStudents({ per_page: 1000 })
      statistics.students = studentsResponse.students

      initCharts()
    } catch (error) {
      ElMessage.error('获取统计数据失败：' + error.message)
    } finally {
      loading.value = false
    }
  }

  // 初始化图表
  const initCharts = () => {
    // 年级分布图表
    if (gradeChartRef.value) {
      gradeChart = echarts.init(gradeChartRef.value)
      gradeChart.setOption({
        title: {
          text: '各年级学生人数',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: Object.keys(statistics.grade_distribution)
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            name: '学生人数',
            type: 'bar',
            data: Object.values(statistics.grade_distribution),
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      })
    }

    // 年龄分布图表
    if (ageChartRef.value) {
      ageChart = echarts.init(ageChartRef.value)
      ageChart.setOption({
        title: {
          text: '年龄分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}人 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle'
        },
        series: [
          {
            name: '年龄分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}人\n{d}%'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            data: calculateAgeDistribution()
          }
        ]
      })
    }
  }

  // 计算年龄分布数据
  const calculateAgeDistribution = () => {
    const ageGroups = {
      '17岁及以下': 0,
      '18岁': 0,
      '19岁': 0,
      '20岁': 0,
      '21岁': 0,
      '22岁': 0,
      '23岁': 0,
      '24岁': 0,
      '25岁及以上': 0
    }

    // 使用后端提供的学生列表数据计算年龄分布
    const students = statistics.students || []
    students.forEach(student => {
      const age = student.age
      if (age <= 17) ageGroups['17岁及以下']++
      else if (age === 18) ageGroups['18岁']++
      else if (age === 19) ageGroups['19岁']++
      else if (age === 20) ageGroups['20岁']++
      else if (age === 21) ageGroups['21岁']++
      else if (age === 22) ageGroups['22岁']++
      else if (age === 23) ageGroups['23岁']++
      else if (age === 24) ageGroups['24岁']++
      else ageGroups['25岁及以上']++
    })

    // 过滤掉数量为0的年龄组，并按年龄排序
    return Object.entries(ageGroups)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value
      }))
  }

  // 窗口大小变化时重绘图表
  const handleResize = () => {
    gradeChart?.resize()
    ageChart?.resize()
  }

  // 生命周期钩子
  onMounted(() => {
    fetchStatistics()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    gradeChart?.dispose()
    ageChart?.dispose()
  })
</script>

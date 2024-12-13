// formOptions.js - 表单配置常量
/**
 * 年级选项配置
 * 用于下拉选择框的选项列表
 */
export const GRADE_OPTIONS = [
  { label: '一年级', value: '一年级' },
  { label: '二年级', value: '二年级' },
  { label: '三年级', value: '三年级' },
  { label: '四年级', value: '四年级' },
  { label: '五年级', value: '五年级' },
  { label: '六年级', value: '六年级' }
]

/**
 * 学生表单验证规则
 * 用于 Element Plus 表单验证
 */
export const STUDENT_FORM_RULES = {
  // 姓名验证规则
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2-10个字符', trigger: 'blur' }
  ],

  // 年龄验证规则
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],

  // 年级验证规则
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],

  // 邮箱验证规则
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

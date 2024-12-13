// useDebounce.js - 防抖函数组合式API
import { ref } from 'vue'

/**
 * 创建一个防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Object} 包含防抖处理后的函数
 */
export function useDebounce(fn, delay = 300) {
  // 用于存储定时器ID
  const timeoutId = ref(null)

  // 防抖处理函数
  const debouncedFn = (...args) => {
    // 如果存在之前的定时器，则清除
    if (timeoutId.value) clearTimeout(timeoutId.value)

    // 设置新的定时器
    timeoutId.value = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  return {
    debouncedFn
  }
}

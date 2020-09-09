import { useEffect } from 'react'

const useDebounce = (func, deps = [], delay = 500) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      func()
    }, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [...deps])
}

export default useDebounce

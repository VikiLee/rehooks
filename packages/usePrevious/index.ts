import { useRef } from 'react'

// usePrevious state
export function usePrevious<T = any | undefined>(value: any): T | undefined {
  // 利用useRef提供的容器保存上个state到容器的current
  const prev = useRef()
  let result = prev.current || undefined
  prev.current = value
  return result
}
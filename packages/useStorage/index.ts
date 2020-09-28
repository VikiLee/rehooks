import { useEffect, useState, useCallback } from 'react'

const prevKey = '_sp_'
function tryParse(value: string | null) {
  if (value === null) {
    return null
  }
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function getItem(key: string) {
  return tryParse(localStorage.getItem(prevKey + key)!)
}

function setItem(key: string, val: any) {
  localStorage.setItem(prevKey + key, 
    typeof val === 'object' 
      ? JSON.stringify(val) 
      : `${val}`
  )
}

interface Option<T> {
  fireRender?: boolean;
  onChange?: (value: T) => void
}

/**
 * 用户获取/设置localStorage，并且在storage中的值改变的时候更新ui
 * 注意： 如果不想在storage修改时改变ui，请设置option的fireRender为false
 */
export function useStorage<T = string> (key: string, initialValue : T, option: Option<T> = {}) {
  const [isInitialized, setInitialized] = useState<boolean>(false) // 删除storage后，需要标记为true，防止rerender又初始化写进storage
  // localStorage中没有值，初始值放入localstorage中
  if (!isInitialized && initialValue !== undefined && !localStorage.getItem(prevKey + key)) {
    setItem(key, initialValue)
    setInitialized(true)
  }

  const [val, setStorage] = useState(getItem(key))

  const set = useCallback((value: Partial<T> | T) => {
    try {
      setItem(key, value)
      if (option.fireRender === undefined || option.fireRender) {
        setStorage(value)
      }
    } catch(err) {
      if (err instanceof TypeError && err.message.includes('circular structure')) {
        throw new TypeError(
          'The object that was given to the writeStorage function has circular references.\n' +
          'For more information, check here: ' + 
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value'
        )
      }
      throw err
    }
  }, [setStorage])

  const remove = () => {
    localStorage.removeItem(prevKey + key)
    if (option.fireRender === undefined || option.fireRender) {
      setStorage(null)
    }
  }

  useEffect(() => {
    const handleChange = (e: StorageEvent) => {
      option.onChange && option.onChange(tryParse(e.newValue))
    }
    window.addEventListener('storage', handleChange)
    return () => window.removeEventListener('storage', handleChange)
  }, [])

  return [val, set, remove]
}

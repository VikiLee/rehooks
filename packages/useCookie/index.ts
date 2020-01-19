import { useEffect, useState, useMemo } from 'react'

export interface CookieOption {
  expires ?: number;
  domain?: string;
  path?: string;
}

export type SetCookieAction = (value: string | boolean | number, options?: CookieOption) => void

export type RemoveCookieAction = () => void

export function getCookie (name: string): string {
  return (document.cookie.match(new RegExp('(^' + name + '| ' + name + ')=([^;]*)')) == null) ? '' : decodeURIComponent(RegExp.$2)
}

export function setCookie (name: string, value: string | boolean | number, options?: CookieOption): void {
  options = options || {}

  let str = name + '=' + encodeURIComponent(String(value)) 
    + `; path=${options.path ? options.path : '/'};`
    + `; domain=${options.domain ? options.domain : ''}`
  if (options.expires) {
    const exp: any = new Date(options.expires)
    str += ' expires=' + exp.toGMTString()
  }
  document.cookie = str
}

export function removeCookie(name: string): void {
  setCookie(name, '', {
    expires: -1
  })
}

export function useCookie(key: string, initValue: string | boolean | number = '', options?: CookieOption): [string, SetCookieAction, RemoveCookieAction] {
  options = options || {}
  // 如果cookie不存在值 将初始化值更新到cookie中
  if (!getCookie(key)) {
    setCookie(key, initValue, options)
  }
  const [value, setValue] = useState(getCookie(key))

  const remove = useMemo(() => (): void => {
    setValue('')
  }, []) 

  const set = useMemo(() => (value: string | boolean | number, options?: CookieOption): void =>{
    options = options || {}
    setCookie(key, initValue, options)
    setValue(value as string)
  }, [])

  // Keep state and cookie in sync 
  useEffect(() => {
    setCookie(key, value)
    if (value === '') {
      removeCookie(key)
    }
  }, [value])

  return [value, set, remove]
}


import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function readStoredTheme() {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    return t === 'dark' || t === 'light' ? t : null
  } catch {
    return null
  }
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Follows prefers-color-scheme until the visitor picks a theme manually.
export default function useTheme() {
  const [stored, setStored] = useState(readStoredTheme)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)
  const isDark = stored ? stored === 'dark' : systemDark

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark'
    setStored(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
  }, [isDark])

  return { isDark, toggle }
}

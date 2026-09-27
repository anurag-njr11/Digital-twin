import { useCallback, useEffect, useRef, useState } from 'react'

// Any link to #twin (hero button, nav) opens the chat panel. Focus goes back to the opener on close.
export default function useTwinPanel() {
  const [open, setOpen] = useState(false)
  const opener = useRef(null)

  const show = useCallback(() => {
    opener.current = document.activeElement
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    opener.current?.focus?.()
  }, [])

  useEffect(() => {
    const check = () => {
      if (window.location.hash !== '#twin') return
      // Drop the hash so the same link works again next time.
      history.replaceState(null, '', window.location.pathname + window.location.search)
      show()
    }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [show])

  return { open, show, hide }
}

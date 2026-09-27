import { useCallback, useEffect, useRef, useState } from 'react'

// Any link to #twin (hero button, nav) opens the chat panel. Focus goes back to the opener on close.
export default function useTwinPanel() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState(null)
  const opener = useRef(null)

  const show = useCallback(() => {
    opener.current = document.activeElement
    setOpen(true)
  }, [])

  // Opens the panel and asks `q` straight away (used by the twin section's suggestions).
  const ask = useCallback(
    (q) => {
      setQuestion(q ?? null)
      show()
    },
    [show],
  )

  const hide = useCallback(() => {
    setOpen(false)
    setQuestion(null)
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

  return { open, question, show, ask, hide }
}

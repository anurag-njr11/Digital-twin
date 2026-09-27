import { useEffect } from 'react'

// Moves a soft glow with the pointer across whichever .glass card is under it (see index.css).
export default function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let last = null
    const onMove = (e) => {
      const card = e.target.closest?.('.glass')
      if (last && last !== card) last.style.removeProperty('--mx')
      last = card
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}

import { useEffect, useRef, useState } from 'react'

// Tracks an element's rendered width so SVG charts can lay out in real pixels
// (text stays the same size; bars stretch) instead of scaling a fixed viewBox.
export default function useElementWidth(fallback = 320) {
  const ref = useRef(null)
  const [width, setWidth] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(Math.round(entry.contentRect.width), 200)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

import { useEffect, useRef } from 'react'

// Muted clip that plays while it's on screen and pauses when it leaves. Never autoplays with reduced motion.
export default function AutoVideo({ video }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <figure>
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        aria-label={video.label}
        controls
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full rounded-xl border border-line"
      />
      <figcaption className="mt-2 text-sm text-stone-400">{video.caption}</figcaption>
    </figure>
  )
}

import { useRef } from 'react'
import useGsap from '../hooks/useGsap'

// Thin aurora bar along the top edge that fills as you read down the page. Decorative only.
export default function ScrollProgress() {
  const ref = useRef(null)

  useGsap(ref, (gsap) => {
    gsap.to(ref.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    })
  })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-linear-to-r from-blue-500 via-violet-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
    />
  )
}

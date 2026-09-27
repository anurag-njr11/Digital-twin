import { useRef } from 'react'
import useGsap, { SCRUB, revealOnScroll, revealTitle } from '../hooks/useGsap'

// Page section with a numbered mono label, a display title and scroll-reveal for [data-reveal] children.
export default function Section({ id, index, title, children }) {
  const ref = useRef(null)

  useGsap(ref, (gsap, ScrollTrigger) => {
    const trigger = ref.current
    gsap.from('[data-section-index]', {
      x: -24,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger, start: 'top 85%', once: true },
    })
    revealTitle(gsap, trigger.querySelector('[data-section-title]'), trigger)
    gsap.from('[data-section-rule]', {
      scaleX: 0,
      transformOrigin: 'left',
      ease: 'none',
      scrollTrigger: { trigger, start: 'top 85%', end: 'top 35%', scrub: SCRUB },
    })
    revealOnScroll(gsap, ScrollTrigger, trigger)
  })

  return (
    <section id={id} ref={ref} aria-labelledby={`${id}-title`} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <p data-section-index className="font-mono text-xs tracking-[0.3em] uppercase text-neon">
        {'// '}
        {index}
      </p>
      <h2 id={`${id}-title`} data-section-title className="text-gradient mt-2 pb-1 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <div data-section-rule className="mt-4 mb-10 h-px w-24 bg-linear-to-r from-blue-500 via-cyan-400 to-transparent" />
      {children}
    </section>
  )
}

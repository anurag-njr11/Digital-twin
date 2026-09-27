import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Runs a GSAP setup scoped to `scopeRef`, only for visitors who haven't asked for reduced motion.
// Content is fully visible without it: animations only use gsap.from/set inside this block,
// and gsap.matchMedia reverts everything on unmount or when the preference changes.
export default function useGsap(scopeRef, setup) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef)
    mm.add('(prefers-reduced-motion: no-preference)', () => setup(gsap, ScrollTrigger))
    return () => mm.revert()
    // Setups are static; run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// Fades and lifts every [data-reveal] element inside `root` as it scrolls into view.
export function revealOnScroll(gsap, ScrollTrigger, root) {
  const items = gsap.utils.toArray('[data-reveal]', root)
  if (!items.length) return
  gsap.set(items, { y: 40, autoAlpha: 0 })
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 }),
  })
}

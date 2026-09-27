import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
// Mobile address bars resize the viewport while scrolling; ignoring that stops scrubbed animations from jumping.
ScrollTrigger.config({ ignoreMobileResize: true })

// How far scrubbed animations lag behind the scrollbar, in seconds. A little lag reads as smooth.
export const SCRUB = 0.8

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

// Cards tilt up out of the page as they scroll into view, in batches so a row lands together.
export function revealOnScroll(gsap, ScrollTrigger, root) {
  const items = gsap.utils.toArray('[data-reveal]', root)
  if (!items.length) return
  // Cards have CSS hover transitions on transform/opacity; they'd fight the tween, so they're off until it ends.
  gsap.set(items, { y: 70, rotateX: 14, scale: 0.94, autoAlpha: 0, transformPerspective: 1000, transformOrigin: '50% 100%', transition: 'none' })
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, rotateX: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: 'expo.out', stagger: 0.1, clearProps: 'transform,transition' }),
  })
}

// Splits a gradient title into words that rise out of a mask one after another.
// Each word gets its own gradient, because background-clip:text breaks across transformed children.
export function revealTitle(gsap, title, trigger) {
  const split = SplitText.create(title, { type: 'words', mask: 'words', wordsClass: 'text-gradient pb-1', aria: 'auto' })
  gsap.set(title, { backgroundImage: 'none' })
  gsap.from(split.words, {
    yPercent: 110,
    rotate: 4,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.08,
    scrollTrigger: { trigger, start: 'top 85%', once: true },
  })
}

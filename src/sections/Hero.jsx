import { useEffect, useRef, useState } from 'react'
import ButtonLink from '../components/ButtonLink'
import useGsap from '../hooks/useGsap'
import profile from '../data/profile.json'
import links from '../data/links.json'
import site from '../data/site.json'

const roles = profile.roleLine.split(' · ')
const [firstName, ...rest] = profile.name.toUpperCase().split(' ')
const lastName = rest.join(' ')

// Per-letter shades so the last name reads as one gradient, even though each letter animates on its own.
const SHADES = [
  'text-blue-800 dark:text-white',
  'text-blue-700 dark:text-cyan-50',
  'text-blue-600 dark:text-cyan-100',
  'text-cyan-700 dark:text-cyan-200',
  'text-cyan-600 dark:text-cyan-300',
  'text-cyan-600 dark:text-cyan-400',
]

function Letters({ word, gradient = false }) {
  return word.split('').map((ch, i) => {
    const shade = gradient ? SHADES[Math.round((i / Math.max(word.length - 1, 1)) * (SHADES.length - 1))] : ''
    return (
      <span key={i} className="inline-block overflow-hidden pb-2">
        <span data-letter className={`inline-block ${shade}`}>
          {ch}
        </span>
      </span>
    )
  })
}

// Types each role from the role line, pauses, deletes, moves on. Static text with reduced motion.
function useTypewriter(words) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let word = 0
    let len = words[0].length
    let deleting = true
    let timer
    const tick = () => {
      const full = words[word]
      len += deleting ? -1 : 1
      setText(full.slice(0, len))
      let wait = deleting ? 35 : 70
      if (!deleting && len === full.length) {
        deleting = true
        wait = 2200
      } else if (deleting && len === 0) {
        deleting = false
        word = (word + 1) % words.length
        wait = 300
      }
      timer = setTimeout(tick, wait)
    }
    timer = setTimeout(tick, 2600)
    return () => clearTimeout(timer)
  }, [words])
  return text
}

export default function Hero() {
  const ref = useRef(null)
  const typed = useTypewriter(roles)

  useGsap(ref, (gsap) => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from('[data-hero-tag]', { y: 20, autoAlpha: 0, duration: 0.8 }, 0.1)
      .from('[data-letter]', { yPercent: 110, autoAlpha: 0, filter: 'blur(12px)', duration: 1.1, stagger: 0.05 }, 0.25)
      .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.9)
      .from('[data-ring]', { scale: 0.6, autoAlpha: 0, duration: 1.6, stagger: 0.15 }, 0)

    // Rings drift apart and fade as the hero scrolls away.
    gsap.to('[data-ring]', {
      y: (i) => (i + 1) * 60,
      scale: (i) => 1 + i * 0.12,
      opacity: (i) => 0.5 / (i + 2),
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  })

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[min(calc(100svh-3.5rem),56rem)] flex-col items-center justify-center overflow-hidden py-20 text-center"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div data-ring className="absolute size-[22rem] rounded-full border border-blue-500/20 sm:size-[26rem] dark:border-white/10" />
        <div data-ring className="absolute size-[34rem] rounded-full border border-blue-500/15 sm:size-[40rem] dark:border-white/5" />
        <div data-ring className="absolute size-[46rem] rounded-full border border-blue-500/10 sm:size-[54rem] dark:border-white/5" />
        <div className="absolute size-[36rem] rounded-full bg-linear-to-tr from-blue-500/10 to-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative">
        <p data-hero-tag className="mb-6 flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
          <span className="size-2 animate-pulse rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          {site.hero.tag}
        </p>

        <h1 id="hero-title" className="font-display text-6xl leading-[0.85] font-bold tracking-tighter sm:text-8xl lg:text-9xl">
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden="true" className="block text-zinc-900 dark:text-white dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <Letters word={firstName} />
          </span>
          <span aria-hidden="true" className="block">
            <Letters word={lastName} gradient />
          </span>
        </h1>

        <p data-hero-fade className="mt-6 flex h-8 items-center justify-center font-mono text-base text-zinc-600 sm:text-2xl dark:text-white/70">
          <span className="sr-only">{profile.roleLine}</span>
          <span aria-hidden="true" className="flex items-center">
            <span className="mr-2 text-blue-600 dark:text-neon">&gt;_</span>
            {typed}
            <span className="ml-1 inline-block h-6 w-2 animate-pulse bg-blue-600 sm:h-7 dark:bg-neon" />
          </span>
        </p>

        <p data-hero-fade className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          {profile.summary}
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {site.twinEnabled && (
            <ButtonLink href="#twin" variant="primary">
              {site.labels.chatWithTwin}
            </ButtonLink>
          )}
          <ButtonLink href={links.github} external>
            {site.labels.github}
          </ButtonLink>
          <ButtonLink href={links.linkedin} external>
            {site.labels.linkedin}
          </ButtonLink>
          {links.resume && (
            <ButtonLink href={links.resume} external>
              {site.labels.resume}
            </ButtonLink>
          )}
        </div>
      </div>

      <a
        href="#about"
        aria-label={site.hero.scrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce rounded-full p-2 text-zinc-400 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-white/40 dark:hover:text-neon-cyan"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}

import { useRef } from 'react'
import useGsap from '../hooks/useGsap'
import research from '../data/research.json'

// Achievement headlines under the hero, taken from the same records as the Research section.
export default function Highlights() {
  const ref = useRef(null)

  useGsap(ref, (gsap) => {
    gsap.from('[data-highlight]', {
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
    })
  })

  return (
    <section aria-label="Achievements" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <ul ref={ref} className="glass grid overflow-hidden rounded-2xl md:grid-cols-3">
        {research.achievements.map((a, i) => (
          <li
            key={a.id}
            data-highlight
            className={`p-6 sm:p-8 ${i ? 'border-t md:border-t-0 md:border-l' : ''} border-zinc-200/80 dark:border-white/[0.07]`}
          >
            <a href="#research" className="group block rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500">
              <p className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl">{a.highlight}</p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.15em] text-zinc-500 uppercase transition group-hover:text-amber-600 dark:text-zinc-400 dark:group-hover:text-amber-300">
                {a.title}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

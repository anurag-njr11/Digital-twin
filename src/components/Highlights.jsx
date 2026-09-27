import { useRef } from 'react'
import useGsap from '../hooks/useGsap'
import site from '../data/site.json'

// Splits "R² ≈ 0.98" into prefix, number, suffix so only the number counts up.
function parts(value) {
  const m = /^(.*?)(\d+(?:\.\d+)?)(.*)$/.exec(value)
  return m ? { pre: m[1], num: Number(m[2]), decimals: (m[2].split('.')[1] ?? '').length, post: m[3] } : null
}

// Strip of headline numbers under the hero. The final value is always in the DOM; with motion
// allowed, the number counts up from zero when the strip scrolls into view.
export default function Highlights() {
  const ref = useRef(null)

  useGsap(ref, (gsap) => {
    for (const el of gsap.utils.toArray('[data-count]', ref.current)) {
      const p = parts(el.dataset.count)
      const counter = { v: 0 }
      gsap.to(counter, {
        v: p.num,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        onUpdate: () => (el.textContent = `${p.pre}${counter.v.toFixed(p.decimals)}${p.post}`),
      })
    }
    gsap.from('[data-highlight]', {
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
    })
  })

  return (
    <section aria-label="Highlights" className="mx-auto max-w-7xl px-4 sm:px-6">
      <dl ref={ref} className="glass grid grid-cols-2 overflow-hidden rounded-2xl lg:grid-cols-4">
        {site.highlights.map((h, i) => (
          <div
            key={h.label}
            data-highlight
            className={`p-6 sm:p-8 ${i % 2 ? '' : 'border-r'} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''} border-zinc-200/80 dark:border-white/[0.07]`}
          >
            <dd
              data-count={h.count === false || !parts(h.value) ? undefined : h.value}
              className="text-gradient font-display text-3xl font-bold tracking-tight tabular-nums sm:text-5xl"
            >
              {h.value}
            </dd>
            <dt className="mt-2 font-mono text-[11px] tracking-[0.15em] text-zinc-500 uppercase dark:text-zinc-400">{h.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

import { useRef } from 'react'
import Section from '../components/Section'
import BulletList from '../components/BulletList'
import useGsap from '../hooks/useGsap'
import experience from '../data/experience.json'
import site from '../data/site.json'

export default function Experience() {
  const ref = useRef(null)

  // The timeline line fills in as you scroll past it.
  useGsap(ref, (gsap) => {
    gsap.from('[data-timeline-fill]', {
      scaleY: 0,
      transformOrigin: 'top',
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 50%', scrub: true },
    })
  })

  return (
    <Section id="experience" index="02" title={site.sections.experience.title}>
      <ol ref={ref} className="relative space-y-10 pl-8">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-zinc-300 dark:bg-white/10" />
        <span aria-hidden="true" data-timeline-fill className="absolute top-2 bottom-2 left-[5px] w-px bg-linear-to-b from-blue-500 via-cyan-400 to-purple-500" />
        {experience.map((job) => (
          <li key={job.id} data-reveal className="relative">
            <span aria-hidden="true" className="absolute top-7 -left-8 size-[11px] rounded-full border-2 border-blue-500 bg-zinc-50 shadow-[0_0_12px_rgba(59,130,246,0.7)] dark:bg-ink" />
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">{job.role}</h3>
                <p className="font-mono text-xs text-blue-700 dark:text-neon">
                  {job.start} – {job.end}
                </p>
              </div>
              <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                {job.company} · <span className="text-zinc-500 dark:text-zinc-400">{job.location}</span>
              </p>
              <BulletList items={job.bullets} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

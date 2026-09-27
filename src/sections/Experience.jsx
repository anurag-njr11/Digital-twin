import { useRef } from 'react'
import Section from '../components/Section'
import InfoCard from '../components/InfoCard'
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
      <ol ref={ref} className="relative space-y-8 pl-8">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-zinc-300 dark:bg-white/10" />
        <span aria-hidden="true" data-timeline-fill className="absolute top-2 bottom-2 left-[5px] w-px bg-linear-to-b from-blue-500 via-violet-500 to-cyan-400" />
        {experience.map((job) => (
          <li key={job.id} className="relative">
            <span aria-hidden="true" className="absolute top-8 -left-8 size-[11px] rounded-full border-2 border-blue-500 bg-slate-50 shadow-[0_0_12px_rgba(59,130,246,0.7)] dark:bg-ink" />
            <InfoCard icon="brief" accent="blue" eyebrow={`${job.start} – ${job.end}`} title={`${job.role} · ${job.company}`} meta={job.location}>
              <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2">
                {job.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-base">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-blue-500 dark:bg-neon-cyan" />
                    {b}
                  </li>
                ))}
              </ul>
            </InfoCard>
          </li>
        ))}
      </ol>
    </Section>
  )
}

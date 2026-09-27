import { useRef } from 'react'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import useGsap, { SCRUB } from '../hooks/useGsap'
import projects from '../data/projects.json'
import site from '../data/site.json'

export default function Projects() {
  const ref = useRef(null)

  useGsap(ref, (gsap) => {
    // Each project opens out from a smaller rounded window as it scrolls up the screen.
    for (const card of gsap.utils.toArray('[data-project]', ref.current)) {
      gsap.fromTo(
        card,
        { clipPath: 'inset(6% 5% 6% 5% round 32px)', scale: 0.94, autoAlpha: 0.2 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 16px)',
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 45%', scrub: SCRUB },
        },
      )
    }
    // Chart bars grow from their baseline when each chart scrolls into view.
    for (const fig of gsap.utils.toArray('figure', ref.current)) {
      const trigger = { trigger: fig, start: 'top 85%', once: true }
      gsap.from(fig.querySelectorAll('[data-bar-h]'), { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power3.out', stagger: 0.08, scrollTrigger: trigger })
      gsap.from(fig.querySelectorAll('[data-bar-v]'), { scaleY: 0, transformOrigin: 'center bottom', duration: 1, ease: 'power3.out', stagger: 0.06, scrollTrigger: trigger })
    }
  })

  return (
    <Section id="projects" index="03" title={site.sections.projects.title}>
      <div ref={ref} className="space-y-8">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </Section>
  )
}

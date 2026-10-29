import Section from '../components/Section'
import InfoCard from '../components/InfoCard'
import experience from '../data/experience.json'
import site from '../data/site.json'

export default function Experience() {
  return (
    <Section id="experience" title={site.sections.experience.title}>
      <ol className="space-y-6">
        {experience.map((job) => (
          <li key={job.id}>
            <InfoCard icon="brief" eyebrow={`${job.start} – ${job.end}`} title={`${job.role} · ${job.company}`} meta={job.location}>
              <ul className="mt-1 list-disc space-y-2 pl-5 text-base">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </InfoCard>
          </li>
        ))}
      </ol>
    </Section>
  )
}

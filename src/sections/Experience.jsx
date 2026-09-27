import Section from '../components/Section'
import BulletList from '../components/BulletList'
import experience from '../data/experience.json'
import site from '../data/site.json'

export default function Experience() {
  return (
    <Section id="experience" title={site.sections.experience.title}>
      <ol className="space-y-10">
        {experience.map((job) => (
          <li key={job.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {job.role} · {job.company}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {job.start} – {job.end}
              </p>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{job.location}</p>
            <BulletList items={job.bullets} />
          </li>
        ))}
      </ol>
    </Section>
  )
}

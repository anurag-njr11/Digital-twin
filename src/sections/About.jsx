import Section from '../components/Section'
import Tag from '../components/Tag'
import profile from '../data/profile.json'
import site from '../data/site.json'

export default function About() {
  const { education } = profile

  return (
    <Section id="about" title={site.sections.about.title}>
      <div className="space-y-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
        {profile.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{site.labels.education}</h3>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">{education.degree}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {education.school}, {education.location} · {education.graduation}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{site.labels.interests}</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {profile.interests.map((i) => (
              <Tag key={i}>{i}</Tag>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

import Section from '../components/Section'
import SubHeading from '../components/SubHeading'
import Tag from '../components/Tag'
import profile from '../data/profile.json'
import site from '../data/site.json'

export default function About() {
  const { education } = profile

  return (
    <Section id="about" index="01" title={site.sections.about.title}>
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-5 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          {profile.about.map((p) => (
            <p key={p} data-reveal>
              {p}
            </p>
          ))}
        </div>

        <div className="space-y-4">
          <div data-reveal className="glass rounded-2xl p-6">
            <SubHeading>{site.labels.education}</SubHeading>
            <p className="mt-3 font-display text-lg font-bold text-zinc-900 dark:text-white">{education.school}</p>
            <p className="mt-1 text-zinc-700 dark:text-zinc-300">{education.degree}</p>
            <p className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {education.location} · {education.graduation}
            </p>
          </div>
          <div data-reveal className="glass rounded-2xl p-6">
            <SubHeading>{site.labels.interests}</SubHeading>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {profile.interests.map((i) => (
                <Tag key={i}>{i}</Tag>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}

import Section from '../components/Section'
import InfoCard from '../components/InfoCard'
import Tag from '../components/Tag'
import profile from '../data/profile.json'
import site from '../data/site.json'

export default function About() {
  const { education } = profile

  return (
    <Section id="about" index="01" title={site.sections.about.title}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-5 text-lg leading-relaxed text-zinc-700 lg:col-span-7 lg:text-xl dark:text-zinc-300">
          {profile.about.map((p, i) => (
            <p key={p} data-reveal className={i === 0 ? 'text-zinc-900 dark:text-white' : undefined}>
              {p}
            </p>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <InfoCard icon="cap" accent="blue" eyebrow={site.labels.education} title={education.school} meta={`${education.location} · ${education.graduation}`}>
            {education.degree}
          </InfoCard>
          <InfoCard icon="spark" accent="violet" eyebrow={site.labels.interests}>
            <ul className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <Tag key={i}>{i}</Tag>
              ))}
            </ul>
          </InfoCard>
        </div>
      </div>
    </Section>
  )
}

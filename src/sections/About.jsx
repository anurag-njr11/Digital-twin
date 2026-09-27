import Section from '../components/Section'
import InfoCard from '../components/InfoCard'
import Tag from '../components/Tag'
import profile from '../data/profile.json'
import site from '../data/site.json'

// Bento: the bio tile spans two rows beside Education and Interests, so all edges line up.
export default function About() {
  const { education } = profile
  const [lead, ...rest] = profile.about

  return (
    <Section id="about" index="01" title={site.sections.about.title}>
      <div className="grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        <div className="lg:col-span-7 lg:row-span-2">
          <InfoCard icon="brain" accent="blue" eyebrow={site.labels.bio}>
            <div className="flex h-full flex-col justify-between gap-6">
              <p className="font-display text-xl leading-snug font-medium text-zinc-900 sm:text-2xl dark:text-white">{lead}</p>
              <div className="space-y-4 text-base leading-relaxed">
                {rest.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </InfoCard>
        </div>

        <div className="lg:col-span-5">
          <InfoCard icon="cap" accent="blue" eyebrow={site.labels.education} title={education.school} meta={`${education.location} · ${education.graduation}`}>
            {education.degree}
          </InfoCard>
        </div>

        <div className="lg:col-span-5">
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

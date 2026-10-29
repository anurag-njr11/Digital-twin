import Section from '../components/Section'
import Tag from '../components/Tag'
import skills from '../data/skills.json'
import site from '../data/site.json'

export default function Skills() {
  return (
    <Section id="skills" title={site.sections.skills.title}>
      <dl className="card divide-y divide-white/[0.07] rounded-2xl">
        {skills.map((g) => (
          <div key={g.group} className="grid gap-3 p-6 sm:grid-cols-[12rem_1fr] sm:items-center">
            <dt className="font-semibold text-white">{g.group}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2" aria-label={g.group}>
                {g.items.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

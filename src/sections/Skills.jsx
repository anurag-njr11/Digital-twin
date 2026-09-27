import Section from '../components/Section'
import Tag from '../components/Tag'
import skills from '../data/skills.json'
import site from '../data/site.json'

export default function Skills() {
  return (
    <Section id="skills" title={site.sections.skills.title}>
      <dl className="space-y-6">
        {skills.map((g) => (
          <div key={g.group}>
            <dt className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{g.group}</dt>
            <dd>
              <ul className="mt-2 flex flex-wrap gap-1.5">
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

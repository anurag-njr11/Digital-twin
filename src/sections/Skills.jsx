import Section from '../components/Section'
import Tag from '../components/Tag'
import skills from '../data/skills.json'
import site from '../data/site.json'

export default function Skills() {
  return (
    <Section id="skills" index="05" title={site.sections.skills.title}>
      <dl className="grid gap-4 md:grid-cols-2">
        {skills.map((g) => (
          <div key={g.group} data-reveal className="glass rounded-2xl p-6">
            <dt className="font-display text-lg font-bold text-zinc-900 dark:text-white">{g.group}</dt>
            <dd>
              <ul className="mt-4 flex flex-wrap gap-2">
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

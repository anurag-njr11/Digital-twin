import Section from '../components/Section'
import InfoCard from '../components/InfoCard'
import Tag from '../components/Tag'
import skills from '../data/skills.json'
import site from '../data/site.json'

const ICONS = ['code', 'brain', 'nodes', 'terminal', 'gauge']
const ACCENTS = ['blue', 'violet', 'cyan', 'blue', 'violet']
// Five groups on a 6-column grid: 3 across, then 2 wider ones, so both rows are full.
const SPANS = ['lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-3', 'md:col-span-2 lg:col-span-3']

export default function Skills() {
  return (
    <Section id="skills" index="05" title={site.sections.skills.title}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        {skills.map((g, i) => (
          <li key={g.group} className={SPANS[i % SPANS.length]}>
            <InfoCard icon={ICONS[i % ICONS.length]} accent={ACCENTS[i % ACCENTS.length]} title={g.group}>
              <ul className="flex flex-wrap gap-2" aria-label={g.group}>
                {g.items.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </ul>
            </InfoCard>
          </li>
        ))}
      </ul>
    </Section>
  )
}

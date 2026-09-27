import Section from '../components/Section'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import skills from '../data/skills.json'
import site from '../data/site.json'

const ICONS = ['code', 'brain', 'nodes', 'terminal', 'gauge']
const CHIPS = [
  'bg-blue-500/10 text-blue-700 ring-blue-500/25 dark:text-blue-300',
  'bg-violet-500/10 text-violet-700 ring-violet-500/25 dark:text-violet-300',
  'bg-cyan-500/10 text-cyan-700 ring-cyan-500/25 dark:text-cyan-300',
]

// One matrix card: a row per group, label on the left, skills flowing across the rest.
// Rows size to their content, so small groups never leave a half-empty card.
export default function Skills() {
  return (
    <Section id="skills" index="05" title={site.sections.skills.title}>
      <div data-reveal className="glass relative overflow-hidden rounded-2xl">
        <span aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-blue-500/0 via-violet-500/70 to-cyan-400/0" />
        <dl className="divide-y divide-zinc-200/80 dark:divide-white/[0.07]">
          {skills.map((g, i) => (
            <div key={g.group} className="grid gap-4 p-6 transition-colors hover:bg-white/40 sm:p-7 lg:grid-cols-[18rem_1fr] lg:items-center dark:hover:bg-white/[0.02]">
              <dt className="flex items-center gap-3">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ${CHIPS[i % CHIPS.length]}`}>
                  <Icon name={ICONS[i % ICONS.length]} />
                </span>
                <span>
                  <span className="block font-display text-lg leading-tight font-bold text-zinc-900 dark:text-white">{g.group}</span>
                  <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    {site.labels.skillCount.replace('{n}', g.items.length)}
                  </span>
                </span>
              </dt>
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
      </div>
    </Section>
  )
}

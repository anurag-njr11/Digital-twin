import Section from '../components/Section'
import SubHeading from '../components/SubHeading'
import BulletList from '../components/BulletList'
import research from '../data/research.json'
import site from '../data/site.json'

const copy = site.sections.research
const card = 'glass rounded-2xl p-6'

export default function Research() {
  return (
    <Section id="research" index="04" title={copy.title}>
      <div className="space-y-12">
        <div>
          <SubHeading>{copy.papers}</SubHeading>
          {research.papers.map((paper) => (
            <article key={paper.id} data-reveal className={`${card} relative mt-4 overflow-hidden`}>
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-blue-500 to-purple-500" />
              <h4 className="font-display text-xl font-bold text-zinc-900 dark:text-white">{paper.title}</h4>
              <p className="mt-1 font-mono text-xs text-blue-700 dark:text-neon">
                {paper.role} · {paper.area}
              </p>
              <BulletList items={paper.bullets} />
            </article>
          ))}
        </div>

        <div>
          <SubHeading>{copy.achievements}</SubHeading>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {research.achievements.map((a) => (
              <li key={a.id} data-reveal className={`${card} text-zinc-700 dark:text-zinc-300`}>
                <span aria-hidden="true" className="mb-3 block h-0.5 w-8 bg-linear-to-r from-cyan-400 to-blue-500" />
                {a.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SubHeading>{copy.certifications}</SubHeading>
            <ul className="mt-4 space-y-4">
              {research.certifications.map((c) => (
                <li key={c.id} data-reveal className={card}>
                  <p className="font-display font-bold text-zinc-900 dark:text-white">{c.name}</p>
                  <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {c.issuer} · {c.date} · {site.labels.credentialId}: {c.credentialId}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubHeading>{copy.leadership}</SubHeading>
            <div data-reveal className={`${card} mt-4`}>
              <BulletList items={research.leadership.map((l) => l.text)} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

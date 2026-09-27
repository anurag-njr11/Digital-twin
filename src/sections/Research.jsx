import Section from '../components/Section'
import SubHeading from '../components/SubHeading'
import BulletList from '../components/BulletList'
import Icon from '../components/Icon'
import InfoCard from '../components/InfoCard'
import research from '../data/research.json'
import site from '../data/site.json'

const copy = site.sections.research

export default function Research() {
  return (
    <Section id="research" index="04" title={copy.title}>
      <div className="space-y-14">
        {research.papers.map((paper) => (
          <article key={paper.id} data-reveal className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <span aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-blue-500/0 via-blue-500/70 to-blue-500/0" />
            <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/25 dark:text-blue-300">
                    <Icon name="book" />
                  </span>
                  <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-blue-700 uppercase dark:text-blue-300">
                    {copy.papers} · {paper.role}
                  </p>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">{paper.title}</h3>
                <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">{paper.area}</p>
                <BulletList items={paper.bullets} />
                {paper.url && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex rounded-full border border-blue-500/40 px-5 py-2 font-mono text-sm font-medium text-blue-700 transition hover:bg-blue-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-neon"
                  >
                    {site.labels.readPaper} →
                  </a>
                )}
              </div>

              <div className="space-y-6">
                {paper.framework && (
                  <div>
                    <SubHeading>{site.labels.framework}</SubHeading>
                    <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                      {paper.framework.map((f, i) => (
                        <li key={f} className="flex gap-3 rounded-xl border border-violet-500/25 bg-violet-500/5 p-3 text-sm text-zinc-800 dark:text-zinc-200">
                          <span className="font-mono text-xs text-violet-700 dark:text-violet-300">{String(i + 1).padStart(2, '0')}</span>
                          {f}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {paper.objective && (
                  <div>
                    <SubHeading>{site.labels.objective}</SubHeading>
                    <blockquote className="mt-3 border-l-2 border-violet-500/60 pl-4 leading-relaxed text-zinc-700 italic dark:text-zinc-300">
                      {paper.objective}
                    </blockquote>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}

        <div>
          <SubHeading>{copy.achievements}</SubHeading>
          <ul className="mt-5 grid gap-5 md:grid-cols-3">
            {research.achievements.map((a) => (
              <li key={a.id}>
                <InfoCard icon="trophy" accent="amber" eyebrow={a.highlight} title={a.title}>
                  {a.detail}
                </InfoCard>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SubHeading>
            {copy.certifications} & {copy.leadership}
          </SubHeading>
          {/* Five equal cards on desktop; 2 + 3 per row on tablets so rows stay full. */}
          <ul className="mt-5 grid gap-5 md:grid-cols-6 lg:grid-cols-5">
            {research.certifications.map((c) => (
              <li key={c.id} className="md:col-span-3 lg:col-span-1">
                <InfoCard icon="badge" accent="cyan" eyebrow={c.issuer} title={c.name} meta={c.date}>
                  <span className="font-mono text-xs">
                    {site.labels.credentialId}: {c.credentialId}
                  </span>
                </InfoCard>
              </li>
            ))}
            {research.leadership.map((l) => (
              <li key={l.id} className="md:col-span-2 lg:col-span-1">
                <InfoCard icon="flag" accent="violet" eyebrow={copy.leadership} title={l.title}>
                  {l.detail}
                </InfoCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

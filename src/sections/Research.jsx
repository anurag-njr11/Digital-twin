import Section from '../components/Section'
import research from '../data/research.json'
import site from '../data/site.json'

const copy = site.sections.research
const col = 'p-6 sm:p-7'
const heading = 'text-sm font-medium text-accent'
const link = 'font-medium text-stone-50 underline decoration-accent/40 underline-offset-4 hover:decoration-accent'

// Two cards with internal columns instead of separate boxes, so short and long columns share one surface.
export default function Research() {
  return (
    <Section id="research" title={copy.title}>
      <ul aria-label={copy.achievements} className="card grid divide-y divide-line rounded-2xl md:grid-cols-3 md:divide-x md:divide-y-0">
        {research.achievements.map((a) => (
          <li key={a.id} className={col}>
            <p className="font-serif text-3xl text-accent">{a.highlight}</p>
            <p className="mt-2 font-semibold text-stone-50">{a.title}</p>
            {a.detail && <p className="mt-1 text-sm leading-relaxed text-stone-400">{a.detail}</p>}
          </li>
        ))}
      </ul>

      <div className="card mt-5 grid divide-y divide-line rounded-2xl lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {research.papers.map((paper) => (
          <article key={paper.id} className={col}>
            <h3 className={heading}>{paper.role}</h3>
            <p className="mt-2 font-semibold text-stone-50">{paper.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">{paper.bullets[0]}</p>
            {paper.url && (
              <a href={paper.url} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block text-sm ${link}`}>
                {site.labels.readPaper} →
              </a>
            )}
          </article>
        ))}
        <div className={col}>
          <h3 className={heading}>{copy.certifications}</h3>
          <ul className="mt-2 space-y-3">
            {research.certifications.map((c) => (
              <li key={c.id}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className={link}>
                  {c.name}
                </a>
                <p className="text-sm text-stone-400">
                  {c.issuer}, {c.date}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className={col}>
          <h3 className={heading}>{copy.leadership}</h3>
          <ul className="mt-2 space-y-3">
            {research.leadership.map((l) => (
              <li key={l.id}>
                <p className="font-medium text-stone-50">{l.title}</p>
                <p className="text-sm leading-relaxed text-stone-400">{l.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

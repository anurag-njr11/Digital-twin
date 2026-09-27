import Section from '../components/Section'
import SubHeading from '../components/SubHeading'
import BulletList from '../components/BulletList'
import research from '../data/research.json'
import site from '../data/site.json'

const copy = site.sections.research

export default function Research() {
  return (
    <Section id="research" title={copy.title}>
      <div className="space-y-10">
        <div>
          <SubHeading>{copy.papers}</SubHeading>
          {research.papers.map((paper) => (
            <article key={paper.id} className="mt-3">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{paper.title}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {paper.role} · {paper.area}
              </p>
              <BulletList items={paper.bullets} />
            </article>
          ))}
        </div>

        <div>
          <SubHeading>{copy.achievements}</SubHeading>
          <BulletList items={research.achievements.map((a) => a.text)} />
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SubHeading>{copy.certifications}</SubHeading>
            <ul className="mt-3 space-y-3">
              {research.certifications.map((c) => (
                <li key={c.id}>
                  <p className="text-zinc-900 dark:text-zinc-100">{c.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {c.issuer} · {c.date} · {site.labels.credentialId}: {c.credentialId}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubHeading>{copy.leadership}</SubHeading>
            <BulletList items={research.leadership.map((l) => l.text)} />
          </div>
        </div>
      </div>
    </Section>
  )
}

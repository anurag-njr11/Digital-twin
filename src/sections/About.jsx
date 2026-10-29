import Section from '../components/Section'
import profile from '../data/profile.json'
import site from '../data/site.json'

// One card: the bio, with a short fact column beside it so both halves share one surface.
export default function About() {
  const { education } = profile
  const [lead, ...rest] = profile.about
  const facts = [
    [site.labels.education, `${education.degree}, ${education.school}`, education.graduation],
    [site.labels.basedIn, profile.location],
    [site.labels.lookingFor, profile.availability],
  ].filter(([, v]) => v)

  return (
    <Section id="about" title={site.sections.about.title}>
      <div className="card grid gap-8 rounded-2xl p-6 sm:p-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="text-xl leading-snug text-stone-100 sm:text-2xl">{lead}</p>
          <div className="mt-5 space-y-4 leading-relaxed text-stone-300">
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <dl className="space-y-5 border-line lg:col-span-4 lg:border-l lg:pl-8">
          {facts.map(([label, value, note]) => (
            <div key={label}>
              <dt className="text-sm font-medium text-accent">{label}</dt>
              <dd className="mt-1 text-stone-200">{value}</dd>
              {note && <dd className="text-sm text-stone-400">{note}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}

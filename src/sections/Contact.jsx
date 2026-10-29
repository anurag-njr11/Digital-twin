import ButtonLink from '../components/ButtonLink'
import Section from '../components/Section'
import links from '../data/links.json'
import site from '../data/site.json'

export default function Contact() {
  return (
    <Section id="contact" title={site.sections.contact.title}>
      <div className="card rounded-2xl p-8 text-center sm:p-12">
        <p className="mx-auto max-w-xl text-lg text-stone-300">{site.sections.contact.blurb}</p>
        <a
          href={`mailto:${links.email}`}
          className="mt-6 inline-block rounded text-2xl font-bold break-all text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-4xl"
        >
          {links.email}
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={`mailto:${links.email}`} variant="primary">
            {site.labels.email}
          </ButtonLink>
          <ButtonLink href={links.github} external>
            {site.labels.github}
          </ButtonLink>
          <ButtonLink href={links.linkedin} external>
            {site.labels.linkedin}
          </ButtonLink>
          {links.resume && (
            <ButtonLink href={links.resume} external>
              {site.labels.resume}
            </ButtonLink>
          )}
        </div>
      </div>
    </Section>
  )
}

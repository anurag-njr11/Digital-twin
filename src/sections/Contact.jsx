import ButtonLink from '../components/ButtonLink'
import Section from '../components/Section'
import links from '../data/links.json'
import site from '../data/site.json'

export default function Contact() {
  return (
    <Section id="contact" index="06" title={site.sections.contact.title}>
      <div data-reveal className="glass relative overflow-hidden rounded-2xl p-8 text-center sm:p-14">
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-96 -translate-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
        <p className="relative mx-auto max-w-xl text-lg text-zinc-300">{site.sections.contact.blurb}</p>
        <a
          href={`mailto:${links.email}`}
          className="text-gradient relative mt-6 inline-block rounded font-display text-2xl font-bold break-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 sm:text-4xl"
        >
          {links.email}
        </a>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
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

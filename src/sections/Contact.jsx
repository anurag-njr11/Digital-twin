import ButtonLink from '../components/ButtonLink'
import Section from '../components/Section'
import links from '../data/links.json'
import site from '../data/site.json'

export default function Contact() {
  return (
    <Section id="contact" title={site.sections.contact.title}>
      <p className="max-w-2xl text-zinc-700 dark:text-zinc-300">{site.sections.contact.blurb}</p>
      <p className="mt-4">
        <a
          href={`mailto:${links.email}`}
          className="rounded text-lg font-medium text-teal-700 underline underline-offset-4 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
        >
          {links.email}
        </a>
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
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
    </Section>
  )
}

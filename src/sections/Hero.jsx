import ButtonLink from '../components/ButtonLink'
import profile from '../data/profile.json'
import links from '../data/links.json'
import site from '../data/site.json'

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="py-16 sm:py-24">
      <p className="text-sm font-medium text-teal-700 dark:text-teal-400">{profile.roleLine}</p>
      <h1 id="hero-title" className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        {profile.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">{profile.summary}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        {site.twinEnabled && (
          <ButtonLink href="#twin" variant="primary">
            {site.labels.chatWithTwin}
          </ButtonLink>
        )}
        <ButtonLink href={links.github} variant={site.twinEnabled ? 'secondary' : 'primary'} external>
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
    </section>
  )
}

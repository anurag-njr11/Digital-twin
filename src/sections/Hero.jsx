import { useState } from 'react'
import ButtonLink from '../components/ButtonLink'
import profile from '../data/profile.json'
import links from '../data/links.json'
import research from '../data/research.json'
import site from '../data/site.json'

const top = research.achievements[0]
const t = site.twin

// Live entry point to the twin: typing here opens the chat panel and asks straight away.
function AskTwin({ onAsk }) {
  const [q, setQ] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (q.trim()) onAsk(q.trim())
  }

  return (
    <div className="card rounded-2xl p-6 sm:p-7">
      <p className="text-sm font-medium text-accent">{site.heroTwin.eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl text-stone-50">{site.heroTwin.title}</h2>
      <p className="mt-2 text-stone-400">{site.heroTwin.text}</p>
      <form onSubmit={submit} className="mt-5 flex gap-2 rounded-xl border border-line bg-bg p-1.5 pl-4 focus-within:border-accent/60">
        <label htmlFor="hero-ask" className="sr-only">
          {t.placeholder}
        </label>
        <input
          id="hero-ask"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={500}
          placeholder={t.placeholder}
          className="min-w-0 flex-1 bg-transparent text-stone-100 placeholder:text-stone-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t.send}
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {site.heroTwin.suggestions.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onAsk(s)}
              className="text-left text-sm text-stone-300 underline decoration-accent/40 underline-offset-4 transition hover:text-stone-50 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Hero({ onAsk }) {
  return (
    <section id="top" aria-labelledby="hero-title" className="mx-auto max-w-6xl px-4 pt-12 pb-6 sm:px-6 sm:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <h1 id="hero-title" className="font-serif text-6xl leading-none text-stone-50 sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-stone-200">{profile.summary}</p>
          <p className="mt-4 text-stone-400">
            {site.hero.tag}
            {profile.availability && (
              <>
                {' · '}
                <span className="font-medium text-accent">{profile.availability}</span>
              </>
            )}
          </p>
          <p className="mt-5 text-stone-300">
            <span className="font-semibold text-stone-50">{top.highlight}</span>, {top.title}. {top.detail}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {links.resume && (
              <ButtonLink href={links.resume} variant="primary" external>
                {site.labels.resume}
              </ButtonLink>
            )}
            <ButtonLink href={links.github} external>
              {site.labels.github}
            </ButtonLink>
            <ButtonLink href={links.linkedin} external>
              {site.labels.linkedin}
            </ButtonLink>
            <ButtonLink href={`mailto:${links.email}`}>{site.labels.email}</ButtonLink>
          </div>
        </div>
        {site.twinEnabled && <AskTwin onAsk={onAsk} />}
      </div>
    </section>
  )
}

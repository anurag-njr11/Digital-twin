import Icon from './Icon'
import site from '../data/site.json'

const cta = site.twinCta

// Band that introduces the AI twin. Each suggestion opens the chat and asks it right away.
export default function TwinCta({ onAsk }) {
  return (
    <section aria-labelledby="twin-cta-title" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div data-reveal className="glass relative overflow-hidden rounded-2xl p-8 sm:p-12">
        <div aria-hidden="true" className="absolute -top-24 -left-24 size-80 rounded-full bg-blue-500/15 blur-[90px]" />
        <div aria-hidden="true" className="absolute -right-24 -bottom-24 size-80 rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="relative grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-neon">
              <span className="size-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              {cta.eyebrow}
            </p>
            <h2 id="twin-cta-title" className="text-gradient mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {cta.title}
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-zinc-300">{cta.text}</p>
            <button
              type="button"
              onClick={() => onAsk()}
              className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-[0_0_30px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 bg-neon text-ink"
            >
              <Icon name="spark" className="size-4" />
              {site.labels.chatWithTwin}
            </button>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
            {site.twin.suggestions.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => onAsk(q)}
                  className="h-full w-full rounded-xl border p-4 text-left text-sm transition hover:-translate-y-0.5 hover:border-blue-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 border-white/10 bg-white/[0.03] text-zinc-200"
                >
                  <span className="font-mono text-neon">→ </span>
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

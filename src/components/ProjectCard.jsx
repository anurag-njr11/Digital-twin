import BarChart from './BarChart'
import GroupedBarChart from './GroupedBarChart'
import SubHeading from './SubHeading'
import Tag from './Tag'
import site from '../data/site.json'

const tile = 'h-full rounded-xl border p-5 sm:p-6 border-white/[0.07] bg-white/[0.02]'

function Chart({ chart }) {
  return chart.kind === 'grouped' ? <GroupedBarChart chart={chart} /> : <BarChart chart={chart} />
}

// Bento layout: every row's tiles stretch to the same height, so nothing leaves a gap.
// Desktop (12 cols): overview 7 + pipeline 5, then charts 4 + 4 + 4 or sample stats 4 + chart 8.
// Tablet (2 cols): overview and pipeline full width, charts two per row with an odd last one full width.
export default function ProjectCard({ project, index }) {
  const { sample, charts = [], pipeline = [] } = project
  const oddLast = (i) => charts.length % 2 === 1 && i === charts.length - 1

  return (
    <article data-project className="glass relative overflow-hidden rounded-2xl p-4 sm:p-5">
      <div aria-hidden="true" className="absolute -top-32 -right-32 size-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <div className={`${tile} flex flex-col md:col-span-2 lg:col-span-7`}>
          <div className="flex items-baseline justify-between gap-3 font-mono text-xs text-zinc-400">
            <span className="text-neon">{String(index + 1).padStart(2, '0')}</span>
            {project.date && <span>{project.date}</span>}
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl text-white">{project.title}</h3>
          <p className="mt-4 leading-relaxed text-zinc-300">{project.summary}</p>

          {project.metrics.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.metrics.map((m) => (
                <li
                  key={m}
                  className="rounded-md border px-2.5 py-1 font-mono text-xs font-medium border-cyan-400/30 bg-cyan-400/10 text-neon-cyan"
                >
                  {m}
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={site.labels.techStack}>
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </ul>

          {project.repo && (
            <div className="mt-auto pt-6">
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-blue-500/40 px-5 py-2 font-mono text-sm font-medium transition hover:bg-blue-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 text-neon"
              >
                {site.labels.repo} →<span className="sr-only">: {project.title}</span>
              </a>
            </div>
          )}
        </div>

        {pipeline.length > 0 && (
          <div className={`${tile} flex flex-col md:col-span-2 lg:col-span-5`}>
            <SubHeading>{site.labels.pipeline}</SubHeading>
            <ol className="relative mt-5 flex flex-1 flex-col justify-between gap-5">
              <span aria-hidden="true" className="absolute top-3 bottom-3 left-[13px] w-px bg-linear-to-b from-blue-500/60 via-violet-500/60 to-cyan-400/60" />
              {pipeline.map((step, i) => (
                <li key={step.title} className="relative flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-blue-500/50 font-mono text-xs bg-ink text-neon">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-zinc-400">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {charts.map((c, i) => (
          <div key={c.id} className={oddLast(i) ? 'md:col-span-2 lg:col-span-4' : 'lg:col-span-4'}>
            <Chart chart={c} />
          </div>
        ))}

        {sample && (
          <>
            <div className={`${tile} flex flex-col md:col-span-2 lg:col-span-4`}>
              <SubHeading>{sample.title}</SubHeading>
              <dl className="mt-4 grid flex-1 grid-cols-3 gap-3 lg:grid-cols-1">
                {sample.stats.map((s) => (
                  <div key={s.label} className="flex flex-col justify-center rounded-lg border px-4 py-3 border-white/10 bg-white/5">
                    <dt className="font-mono text-[10px] tracking-wider uppercase text-zinc-400">{s.label}</dt>
                    <dd className="mt-1 font-mono text-lg font-semibold text-white">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="md:col-span-2 lg:col-span-8">
              <Chart chart={sample.chart} />
            </div>
          </>
        )}
      </div>
    </article>
  )
}

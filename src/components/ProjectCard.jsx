import BarChart from './BarChart'
import GroupedBarChart from './GroupedBarChart'
import SubHeading from './SubHeading'
import Tag from './Tag'
import site from '../data/site.json'

function Chart({ chart }) {
  return chart.kind === 'grouped' ? <GroupedBarChart chart={chart} /> : <BarChart chart={chart} />
}

// Full-width project feature: story and pipeline on the left, evidence (charts or a sample run) on the right.
export default function ProjectCard({ project, index }) {
  const { sample, charts = [], pipeline = [] } = project

  return (
    <article data-reveal className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <div aria-hidden="true" className="absolute -top-32 -right-32 size-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between gap-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            <span className="text-blue-700 dark:text-neon">{String(index + 1).padStart(2, '0')}</span>
            {project.date && <span>{project.date}</span>}
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">{project.title}</h3>
          <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-300">{project.summary}</p>

          {project.metrics.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.metrics.map((m) => (
                <li
                  key={m}
                  className="rounded-md border border-cyan-600/30 bg-cyan-50 px-2.5 py-1 font-mono text-xs font-medium text-cyan-800 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-neon-cyan"
                >
                  {m}
                </li>
              ))}
            </ul>
          )}

          {pipeline.length > 0 && (
            <div className="mt-6">
              <SubHeading>{site.labels.pipeline}</SubHeading>
              <ol className="mt-3 space-y-3">
                {pipeline.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-blue-500/40 font-mono text-[11px] text-blue-700 dark:text-neon">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{step.title}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={site.labels.techStack}>
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </ul>

          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border border-blue-500/40 px-5 py-2 font-mono text-sm font-medium text-blue-700 transition hover:bg-blue-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-neon"
            >
              {site.labels.repo} →<span className="sr-only">: {project.title}</span>
            </a>
          )}
        </div>

        <div className="space-y-4">
          {sample && (
            <div className="space-y-4">
              <SubHeading>{sample.title}</SubHeading>
              <dl className="grid grid-cols-3 gap-3">
                {sample.stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-zinc-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
                    <dt className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase dark:text-zinc-400">{s.label}</dt>
                    <dd className="mt-1 font-mono text-sm font-semibold text-zinc-900 dark:text-white">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <Chart chart={sample.chart} />
            </div>
          )}
          {charts.map((c) => (
            <Chart key={c.id} chart={c} />
          ))}
        </div>
      </div>
    </article>
  )
}

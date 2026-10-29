import AutoVideo from './AutoVideo'
import BarChart from './BarChart'
import GroupedBarChart from './GroupedBarChart'
import Tag from './Tag'
import site from '../data/site.json'

function Chart({ chart }) {
  return chart.kind === 'grouped' ? <GroupedBarChart chart={chart} /> : <BarChart chart={chart} />
}

function ProjectLink({ href, label, title }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-stone-50 underline decoration-accent/40 underline-offset-4 transition hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label} →<span className="sr-only">: {title}</span>
    </a>
  )
}

// Showcase card in full-width rows, so no column is left waiting on a taller neighbour:
// the visual (video or charts), then pitch beside numbers and stack, then the pipeline strip.
export default function ProjectCard({ project }) {
  const { video, charts = [], pipeline = [] } = project

  return (
    <article className="card rounded-2xl p-5 sm:p-7 motion-safe:transition motion-safe:hover:-translate-y-0.5 hover:border-stone-600">
      {video && <AutoVideo video={video} />}
      {charts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {charts.map((c) => (
            <Chart key={c.id} chart={c} />
          ))}
        </div>
      )}

      <div className={`grid gap-x-10 gap-y-5 lg:grid-cols-12 ${video || charts.length ? 'mt-7' : ''}`}>
        <div className="lg:col-span-7">
          <p className="flex items-center gap-3 text-sm text-stone-400">
            {project.featured && <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-medium text-accent">{site.labels.featured}</span>}
            {project.date}
          </p>
          <h3 className="mt-2 font-serif text-3xl leading-tight text-stone-50 sm:text-4xl">{project.title}</h3>
          <p className="mt-3 leading-relaxed text-stone-300">{project.summary}</p>
          {project.note && <p className="mt-4 border-l-2 border-accent/50 pl-3 text-sm leading-relaxed text-stone-400">{project.note}</p>}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5 lg:pt-7">
          {project.metrics.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {project.metrics.map((m) => (
                <li key={m} className="rounded-md bg-accent/10 px-2.5 py-1 font-mono text-xs font-medium text-accent">
                  {m}
                </li>
              ))}
            </ul>
          )}
          <ul className="flex flex-wrap gap-1.5" aria-label={site.labels.techStack}>
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </ul>
          {(project.repo || project.demo) && (
            <div className="flex flex-wrap gap-5">
              {project.demo && <ProjectLink href={project.demo} label={site.labels.demo} title={project.title} />}
              {project.repo && <ProjectLink href={project.repo} label={site.labels.repo} title={project.title} />}
            </div>
          )}
        </div>
      </div>

      {pipeline.length > 0 && (
        <ol aria-label={site.labels.pipeline} className="mt-6 grid gap-4 border-t border-line pt-5 md:grid-cols-3">
          {pipeline.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="font-medium text-stone-100">{step.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-stone-400">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </article>
  )
}

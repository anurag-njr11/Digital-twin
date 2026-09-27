import Tag from './Tag'
import site from '../data/site.json'

export default function ProjectCard({ project, index }) {
  return (
    <article
      data-reveal
      className="glass group relative flex flex-col overflow-hidden rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(37,99,235,0.15)]"
    >
      <div aria-hidden="true" className="absolute -top-24 -right-24 size-48 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition group-hover:opacity-100" />
      <div className="flex items-baseline justify-between gap-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        <span className="text-blue-700 dark:text-neon">{String(index + 1).padStart(2, '0')}</span>
        {project.date && <span>{project.date}</span>}
      </div>
      <h3 className="mt-3 font-display text-xl font-bold text-zinc-900 dark:text-white">{project.title}</h3>

      <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{project.summary}</p>

      {project.metrics.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.metrics.map((m) => (
            <li
              key={m}
              className="rounded-md border border-cyan-500/30 bg-cyan-50 px-2.5 py-1 font-mono text-xs font-medium text-cyan-800 dark:bg-cyan-400/10 dark:text-neon-cyan"
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
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto self-start rounded pt-5 font-mono text-sm font-medium text-blue-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-neon"
        >
          {site.labels.repo} →<span className="sr-only">: {project.title}</span>
        </a>
      )}
    </article>
  )
}

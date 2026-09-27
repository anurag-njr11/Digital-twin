import Tag from './Tag'
import site from '../data/site.json'

export default function ProjectCard({ project }) {
  return (
    <article className="flex flex-col rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{project.title}</h3>
        {project.date && <p className="text-sm text-zinc-500 dark:text-zinc-400">{project.date}</p>}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{project.summary}</p>

      {project.metrics.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.metrics.map((m) => (
            <li
              key={m}
              className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-300"
            >
              {m}
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={site.labels.techStack}>
        {project.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </ul>

      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 self-start rounded text-sm font-medium text-teal-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:text-teal-400"
        >
          {site.labels.repo}
          <span className="sr-only">: {project.title}</span>
        </a>
      )}
    </article>
  )
}

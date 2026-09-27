import links from '../data/links.json'
import site from '../data/site.json'

const t = site.twin

function errorText(code) {
  return (t.errors[code] ?? t.errors.upstream).replace('{email}', links.email)
}

export default function ChatMessage({ message, onSource }) {
  if (message.role === 'user') {
    return (
      <li className="ml-8 self-end rounded-lg bg-blue-600 px-3 py-2 text-sm whitespace-pre-wrap text-white dark:bg-blue-500 dark:text-zinc-950">
        <span className="sr-only">{t.you}: </span>
        {message.content}
      </li>
    )
  }

  const streaming = message.status === 'streaming'
  return (
    <li className="mr-8 self-start rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100">
      <span className="sr-only">{t.twin}: </span>
      {message.status === 'error' ? (
        <p className="text-red-700 dark:text-red-400">{errorText(message.error)}</p>
      ) : (
        <p className="whitespace-pre-wrap">{message.content || (streaming && <span className="text-zinc-500 dark:text-zinc-400">{t.thinking}</span>)}</p>
      )}

      {message.sources?.length > 0 && (
        <div className="mt-2">
          <p className="sr-only">{t.sources}</p>
          <ul className="flex flex-wrap gap-1.5">
            {message.sources.map((s) => (
              <li key={s.title}>
                {s.anchor ? (
                  <button
                    type="button"
                    onClick={() => onSource(s.anchor)}
                    className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs text-zinc-700 hover:border-blue-600 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-600 dark:text-zinc-300 dark:hover:text-blue-300"
                  >
                    {s.section}: {s.title}
                  </button>
                ) : (
                  <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
                    {s.section}: {s.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

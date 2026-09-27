import TwinAvatar from './TwinAvatar'
import TypingDots from './TypingDots'
import links from '../data/links.json'
import site from '../data/site.json'

const t = site.twin

function errorText(code) {
  return (t.errors[code] ?? t.errors.upstream).replace('{email}', links.email)
}

const BUBBLE = {
  refused: 'border-amber-400/25 bg-amber-400/[0.05]',
  error: 'border-red-400/30 bg-red-500/[0.06] text-red-300',
}

export default function ChatMessage({ message, onSource }) {
  if (message.role === 'user') {
    return (
      <li className="ml-10 animate-msg-in self-end rounded-2xl rounded-br-md border border-blue-500/30 bg-blue-500/15 px-4 py-2.5 text-sm whitespace-pre-wrap text-blue-50">
        <span className="sr-only">{t.you}: </span>
        {message.content}
      </li>
    )
  }

  const streaming = message.status === 'streaming'
  return (
    <li className="mr-6 flex animate-msg-in items-end gap-2.5 self-start">
      <TwinAvatar size="sm" busy={streaming} />
      <div
        className={`min-w-0 rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-relaxed text-zinc-100 ${BUBBLE[message.status] ?? 'border-white/10 bg-white/[0.04]'}`}
      >
        <span className="sr-only">{t.twin}: </span>
        {message.status === 'error' ? (
          <p>{errorText(message.error)}</p>
        ) : streaming && !message.content ? (
          <TypingDots label={t.thinking} />
        ) : (
          <p className="whitespace-pre-wrap">
            {message.content}
            {streaming && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-caret rounded-sm bg-cyan-300" />}
          </p>
        )}

        {message.sources?.length > 0 && (
          <div className="mt-2">
            <p className="sr-only">{t.sources}</p>
            <ul className="flex flex-wrap gap-1.5">
              {message.sources.map((s) => (
                <li key={s.title} className="animate-pop-in">
                  {s.anchor ? (
                    <button
                      type="button"
                      onClick={() => onSource(s.anchor)}
                      className="rounded-full border border-cyan-400/25 px-2.5 py-0.5 text-xs text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      {s.section}: {s.title} →
                    </button>
                  ) : (
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400">
                      {s.section}: {s.title}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  )
}

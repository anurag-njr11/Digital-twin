import TwinAvatar from './TwinAvatar'
import TypingDots from './TypingDots'
import links from '../data/links.json'
import site from '../data/site.json'

const t = site.twin

function errorText(code) {
  return (t.errors[code] ?? t.errors.upstream).replace('{email}', links.email)
}

const BUBBLE = {
  refused: 'border-line bg-surface text-stone-300',
  error: 'border-red-400/30 bg-red-500/[0.06] text-red-300',
}

export default function ChatMessage({ message, onSource }) {
  if (message.role === 'user') {
    return (
      <li className="ml-10 animate-msg-in self-end rounded-2xl rounded-br-md bg-stone-800 px-4 py-2.5 text-sm whitespace-pre-wrap text-stone-100">
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
        className={`min-w-0 rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-relaxed text-stone-100 ${BUBBLE[message.status] ?? 'border-line bg-surface'}`}
      >
        <span className="sr-only">{t.twin}: </span>
        {message.status === 'error' ? (
          <p>{errorText(message.error)}</p>
        ) : streaming && !message.content ? (
          <TypingDots label={t.thinking} />
        ) : (
          <p className="whitespace-pre-wrap">
            {message.content}
            {streaming && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-caret rounded-sm bg-accent" />}
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
                      className="rounded-full border border-accent/25 px-2.5 py-0.5 text-xs text-accent transition hover:border-accent/60 hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {s.section}: {s.title} →
                    </button>
                  ) : (
                    <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-stone-400">
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

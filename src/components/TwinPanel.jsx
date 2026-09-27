import { useEffect, useRef, useState } from 'react'
import ChatMessage from './ChatMessage'
import useTwinChat from '../hooks/useTwinChat'
import site from '../data/site.json'

const t = site.twin
const MAX_CHARS = 500

const iconButton =
  'rounded-md p-2 text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-zinc-400 dark:hover:bg-zinc-800'

// Slide-over chat with the twin (R4.1, R4.2). Lazy-loaded on first open so it stays out of the initial bundle (N1.2).
export default function TwinPanel({ onClose }) {
  const { messages, busy, send, clear } = useTwinChat()
  const [draft, setDraft] = useState('')
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const logRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab') return
      // Keep keyboard focus inside the dialog (N4.1).
      const focusable = panelRef.current.querySelectorAll('button:not(:disabled), textarea, a[href]')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  const submit = (text) => {
    if (!text.trim() || busy) return
    send(text)
    setDraft('')
  }

  const goToSource = (anchor) => {
    // On small screens the panel covers the page, so get out of the way first.
    if (!window.matchMedia('(min-width: 768px)').matches) onClose()
    document.querySelector(anchor)?.scrollIntoView()
  }

  const last = messages.at(-1)
  const announcement =
    last?.role === 'assistant' ? (last.status === 'streaming' ? t.thinking : last.status === 'error' ? '' : last.content) : ''

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="twin-title"
        aria-describedby="twin-disclosure"
        className="absolute inset-y-0 right-0 flex w-full animate-slide-in flex-col border-l border-zinc-200 bg-white/95 shadow-2xl backdrop-blur-xl md:max-w-md dark:border-white/10 dark:bg-[#07070c]/95"
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-white/10">
          <h2 id="twin-title" className="font-display text-lg font-bold text-zinc-900 dark:text-white">
            {t.title}
          </h2>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button type="button" onClick={clear} className={`${iconButton} text-sm`}>
                {t.clear}
              </button>
            )}
            <button type="button" onClick={onClose} aria-label={t.close} className={iconButton}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </header>

        <div ref={logRef} className="flex-1 overflow-y-auto px-4 py-4">
          <p id="twin-disclosure" className="text-sm text-zinc-600 dark:text-zinc-400">
            {t.disclosure}
          </p>

          {messages.length === 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {t.suggestions.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => submit(q)}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-700 hover:border-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="mt-4 flex flex-col gap-3">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} onSource={goToSource} />
              ))}
            </ol>
          )}
        </div>

        {/* Announce whole replies, not every token (N4.2). */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>

        <form
          className="border-t border-zinc-200 p-3 dark:border-white/10"
          onSubmit={(e) => {
            e.preventDefault()
            submit(draft)
          }}
        >
          <div className="flex items-end gap-2">
            <label htmlFor="twin-input" className="sr-only">
              {t.placeholder}
            </label>
            <textarea
              id="twin-input"
              ref={inputRef}
              rows={2}
              maxLength={MAX_CHARS}
              value={draft}
              placeholder={t.placeholder}
              aria-describedby="twin-count"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit(draft)
                }
              }}
              className="min-h-10 flex-1 resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 dark:bg-blue-500 dark:text-zinc-950 dark:hover:bg-blue-400"
            >
              {t.send}
            </button>
          </div>
          <p id="twin-count" className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">
            {t.charCount.replace('{count}', draft.length).replace('{max}', MAX_CHARS)}
          </p>
        </form>
      </div>
    </div>
  )
}

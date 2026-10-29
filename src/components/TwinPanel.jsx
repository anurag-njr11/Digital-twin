import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ChatMessage from './ChatMessage'
import TwinAvatar from './TwinAvatar'
import useTwinChat from '../hooks/useTwinChat'
import site from '../data/site.json'

const t = site.twin
const MAX_CHARS = 500
const STATUS_DOT = {
  idle: 'bg-accent',
  thinking: 'animate-pulse bg-accent',
  writing: 'animate-pulse bg-accent',
  error: 'bg-red-400',
}

const iconButton =
  'inline-flex items-center gap-1.5 rounded-full p-2 text-stone-400 transition hover:bg-surface hover:text-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// Slide-over chat with the twin (R4.1, R4.2). Lazy-loaded on first open so it stays out of the initial bundle (N1.2).
export default function TwinPanel({ onClose, initialQuestion }) {
  const { messages, busy, send } = useTwinChat()
  const asked = useRef(false)
  const [draft, setDraft] = useState('')
  const panelRef = useRef(null)
  const backdropRef = useRef(null)
  const closing = useRef(false)
  const inputRef = useRef(null)
  const logRef = useRef(null)

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Slide in on open. Only transform and opacity animate, so it stays smooth.
  useLayoutEffect(() => {
    if (reduced()) return
    const tl = gsap
      .timeline({ defaults: { duration: 0.55, ease: 'expo.out' } })
      .from(backdropRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' })
      .from(panelRef.current, { xPercent: 100 }, 0)
    return () => tl.revert()
  }, [])

  // Slide out, then unmount.
  const close = useCallback(
    (after) => {
      if (closing.current) return
      closing.current = true
      const done = () => {
        onClose()
        after?.()
      }
      if (reduced()) return done()
      gsap
        .timeline({ defaults: { duration: 0.4, ease: 'power3.in' }, onComplete: done })
        .to(panelRef.current, { xPercent: 100 })
        .to(backdropRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.1)
    },
    [onClose],
  )

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
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
  }, [close])

  // A question passed in from the page is sent once (the ref survives StrictMode's double effect).
  useEffect(() => {
    if (initialQuestion && !asked.current) {
      asked.current = true
      send(initialQuestion)
    }
  }, [initialQuestion, send])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  const submit = (text) => {
    if (!text.trim() || busy) return
    send(text)
    setDraft('')
  }

  const goToSource = (anchor) => {
    const go = () => document.querySelector(anchor)?.scrollIntoView()
    // On small screens the panel covers the page, so get out of the way first.
    if (window.matchMedia('(min-width: 768px)').matches) go()
    else close(go)
  }

  const last = messages.at(-1)
  const state = busy ? (last.content ? 'writing' : 'thinking') : last?.status === 'error' ? 'error' : 'idle'
  const announcement =
    last?.role === 'assistant' ? (last.status === 'streaming' ? t.thinking : last.status === 'error' ? '' : last.content) : ''

  return (
    <div className="fixed inset-0 z-50">
      <div ref={backdropRef} className="absolute inset-0 bg-bg/70" aria-hidden="true" onClick={() => close()} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="twin-title"
        aria-describedby="twin-disclosure"
        className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-line bg-bg shadow-2xl will-change-transform md:max-w-md"
      >
        <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
          <TwinAvatar busy={busy} />
          <div className="min-w-0 flex-1">
            <h2 id="twin-title" className="font-serif text-2xl leading-tight text-stone-50">
              {t.title}
            </h2>
            <p aria-hidden="true" className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-400">
              <span className={`size-1.5 rounded-full ${STATUS_DOT[state]}`} />
              {t.status[state]}
            </p>
          </div>
          <button type="button" onClick={() => close()} aria-label={t.close} className={iconButton}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div ref={logRef} className="flex-1 overflow-y-auto px-4 py-5">
          {messages.length === 0 ? (
            <div className="animate-msg-in">
              <TwinAvatar size="lg" />
              <p className="mt-4 font-serif text-3xl text-stone-50">{t.welcome}</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">{t.welcomeText}</p>
              <p id="twin-disclosure" className="mt-2 text-xs text-stone-500">
                {t.disclosure}
              </p>
              <p className="mt-6 mb-2 text-sm font-medium text-accent">{t.tryAsking}</p>
              <ul className="flex flex-col gap-2">
                {t.suggestions.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => submit(q)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm text-stone-200 transition hover:border-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span className="flex-1">{q}</span>
                      <span aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p id="twin-disclosure" className="text-center text-xs text-stone-500">
                {t.disclosure}
              </p>
              <ol className="mt-4 flex flex-col gap-4">
                {messages.map((m) => (
                  <ChatMessage key={m.id} message={m} onSource={goToSource} />
                ))}
              </ol>
            </>
          )}
        </div>

        {/* Announce whole replies, not every token (N4.2). */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>

        <form
          className="border-t border-line bg-surface p-3"
          onSubmit={(e) => {
            e.preventDefault()
            submit(draft)
          }}
        >
          <div className="flex items-end gap-2 rounded-xl border border-line bg-bg p-1.5 pl-4 transition focus-within:border-accent/60">
            <label htmlFor="twin-input" className="sr-only">
              {t.placeholder}
            </label>
            <textarea
              id="twin-input"
              ref={inputRef}
              rows={1}
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
              className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm text-stone-100 field-sizing-content placeholder:text-stone-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              aria-label={t.send}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-on-accent transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
          <p id="twin-count" className="mt-1 text-right font-mono text-[11px] text-stone-500">
            {t.charCount.replace('{count}', draft.length).replace('{max}', MAX_CHARS)}
          </p>
        </form>
      </div>
    </div>
  )
}

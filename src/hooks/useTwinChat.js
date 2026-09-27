import { useCallback, useEffect, useRef, useState } from 'react'
import { readEvents } from '../lib/sse'

const STORAGE_KEY = 'twin-chat'
const MAX_HISTORY = 19 // plus the new question = the API's 20-message limit

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    // A reply that was mid-stream when the page reloaded can't be resumed.
    return Array.isArray(saved) ? saved.filter((m) => m.status !== 'streaming') : []
  } catch {
    return []
  }
}

// Only answered turns go back to the model; refusals and errors would just add noise.
function history(messages) {
  const out = []
  for (let i = 0; i < messages.length - 1; i++) {
    const [q, a] = [messages[i], messages[i + 1]]
    if (q.role === 'user' && a.role === 'assistant' && a.status === 'done') {
      out.push({ role: 'user', content: q.content }, { role: 'assistant', content: a.content })
    }
  }
  return out.slice(-MAX_HISTORY + 1)
}

let nextId = Date.now()

// Chat state for the twin panel. History lives in sessionStorage only, so it clears when the tab closes (R4.5).
export default function useTwinChat() {
  const [messages, setMessages] = useState(load)
  const abortRef = useRef(null)
  const busy = messages.at(-1)?.status === 'streaming'

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // Storage can be blocked; the chat still works for this visit.
    }
  }, [messages])

  useEffect(() => () => abortRef.current?.abort(), [])

  const update = (id, patch) =>
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...(typeof patch === 'function' ? patch(m) : patch) } : m)))

  const send = useCallback(
    async (text) => {
      const content = text.trim()
      if (!content || busy) return
      const id = nextId++
      const past = history(messages)
      setMessages((ms) => [
        ...ms,
        { id: nextId++, role: 'user', content },
        { id, role: 'assistant', content: '', status: 'streaming', sources: [] },
      ])

      const controller = new AbortController()
      abortRef.current = controller
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...past, { role: 'user', content }] }),
          signal: controller.signal,
        })
        if (!res.ok || !res.body) {
          const code = (await res.json().catch(() => null))?.error?.code ?? 'upstream'
          return update(id, { status: 'error', error: code })
        }
        for await (const { event, data } of readEvents(res.body)) {
          if (event === 'token') update(id, (m) => ({ content: m.content + data.text }))
          else if (event === 'sources') update(id, { sources: data })
          // A refusal replaces anything already streamed (e.g. an answer stopped by the output check).
          else if (event === 'refusal') update(id, { content: data.message, status: 'refused' })
          else if (event === 'error') update(id, { status: 'error', error: data.code })
          else if (event === 'done') update(id, (m) => ({ status: m.status === 'streaming' ? 'done' : m.status }))
        }
        update(id, (m) => (m.status === 'streaming' ? { status: 'error', error: 'upstream' } : {}))
      } catch (err) {
        if (err.name !== 'AbortError') update(id, { status: 'error', error: 'network' })
      }
    },
    [busy, messages],
  )

  const clear = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
  }, [])

  return { messages, busy, send, clear }
}

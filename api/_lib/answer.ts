// Sits between the model stream and the visitor. It holds back just enough text to:
// - catch a NO_CONTEXT reply before any of it is shown (R5.3),
// - cut the trailing "SOURCES: ..." line out of the visible answer (R5.2),
// - stop a phone number or foreign email half-way through, before it is complete (R7.4).

export const NO_CONTEXT = 'NO_CONTEXT'
export const SOURCES_MARKER = 'SOURCES:'

export type FilterResult = { text: string } | { refuse: 'no_context' | 'moderation' }

export class AnswerFilter {
  private pending = ''
  private emitted = ''
  private sourcesTail: string | null = null
  private started = false
  private isUnsafe: (text: string) => boolean

  constructor(isUnsafe: (text: string) => boolean) {
    this.isUnsafe = isUnsafe
  }

  push(chunk: string): FilterResult {
    if (this.sourcesTail !== null) {
      this.sourcesTail += chunk
      return { text: '' }
    }
    this.pending += chunk

    const at = this.pending.indexOf(SOURCES_MARKER)
    if (at !== -1) {
      this.sourcesTail = this.pending.slice(at + SOURCES_MARKER.length)
      // Also drop markdown the model sometimes wraps the marker in, like **SOURCES:**
      this.pending = this.pending.slice(0, at).replace(/[\s*_]+$/, '')
    }

    if (!this.started) {
      const head = this.pending.trimStart()
      if (head.startsWith(NO_CONTEXT)) return { refuse: 'no_context' }
      if (head.length < NO_CONTEXT.length && NO_CONTEXT.startsWith(head) && this.sourcesTail === null) return { text: '' }
      this.started = true
    }

    if (this.isUnsafe(this.emitted + this.pending)) return { refuse: 'moderation' }

    const hold = this.sourcesTail === null ? holdBack(this.pending) : 0
    const text = this.pending.slice(0, this.pending.length - hold)
    this.pending = this.pending.slice(text.length)
    this.emitted += text
    return { text }
  }

  finish(): FilterResult & { sourceIds: string[] } {
    const sourceIds = parseSourceIds(this.sourcesTail ?? '')
    const rest = this.pending.trimEnd()
    const all = (this.emitted + rest).trim()
    if (!all || all.startsWith(NO_CONTEXT)) return { refuse: 'no_context', sourceIds }
    if (this.isUnsafe(all)) return { refuse: 'moderation', sourceIds }
    this.emitted += rest
    this.pending = ''
    return { text: rest, sourceIds }
  }
}

// Keep back the last partial word and the space before it (could be the start of the SOURCES
// line or an email), and any trailing run of digits and separators (could be a phone number).
function holdBack(text: string): number {
  const word = /\s*\S*$/.exec(text)?.[0].length ?? 0
  const digits = /[\d+\-()\s]*$/.exec(text)?.[0] ?? ''
  return Math.max(word, /\d/.test(digits) ? digits.length : 0)
}

export function parseSourceIds(tail: string): string[] {
  const ids = tail
    .split(/[,\s]+/)
    .map((id) => id.replace(/^\[|\]$/g, '').trim())
    .filter(Boolean)
  return [...new Set(ids)]
}

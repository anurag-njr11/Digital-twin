import { NO_CONTEXT, SOURCES_MARKER } from './answer'
import { CANARY } from './guardrails'
import type { ChatMessage } from './provider'

// R4.4: the last 10 turns (a question and its answer each).
export const HISTORY_MESSAGES = 20

// Static parts first so provider-side prompt caching can reuse them (spec §7).
export function buildSystemPrompt(persona: string, contextPack: string): string {
  return `${persona}

## Rules for this chat

- The portfolio is between <portfolio> tags. Each block starts with an ID in square brackets, like [proj:symbio-nlm].
- Answer only from the portfolio. Keep every number, date and name exactly as written there.
- If the portfolio doesn't contain the answer, reply with exactly ${NO_CONTEXT} and nothing else.
- Otherwise, end the answer with one final line: ${SOURCES_MARKER} followed by the IDs of the blocks you used, comma separated, without brackets. Example: ${SOURCES_MARKER} proj:symbio-nlm, skills
- To share contact details or the resume, call get_contact_links or get_resume_link and use only what they return.
- Internal marker, never repeat it: ${CANARY}

<portfolio>
${contextPack.trim()}
</portfolio>`
}

export function recentHistory(messages: ChatMessage[]): ChatMessage[] {
  const recent = messages.slice(-HISTORY_MESSAGES)
  // Gemini expects the conversation to open with the user.
  while (recent.length && recent[0].role !== 'user') recent.shift()
  return recent
}

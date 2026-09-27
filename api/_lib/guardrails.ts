import { EMAIL, PHONE } from '../../src/lib/pii.js'

export type RefusalReason = 'out_of_scope' | 'no_context' | 'moderation'

// Which fixed reply (from twin/persona.md) to send for a refused question.
export type InputVerdict = { reason: RefusalReason; reply: 'out_of_scope' | 'contact' } | null

// Cheap first line of defence (R7.1, R7.3, R7.4). The persona rules and the output check
// catch what these miss; these only need to be right when they fire.
const INPUT_RULES: { reply: 'out_of_scope' | 'contact'; pattern: RegExp }[] = [
  // Narrow on purpose: "mobile app" or "address class imbalance" must still get real answers.
  { reply: 'contact', pattern: /\b(phone|mobile number|cell ?phone|whats ?app|contact number|call you)\b/i },
  { reply: 'contact', pattern: /\bhome address\b|\bwhere (exactly )?do you live\b/i },
  { reply: 'out_of_scope', pattern: /\b(salary|stipend|ctc|lpa|compensation|expected pay)\b|how much .*\b(pay|earn|paid)\b/i },
  { reply: 'out_of_scope', pattern: /\b(politic\w*|election|religio\w*|caste|vote|voting)\b/i },
  { reply: 'out_of_scope', pattern: /\b(girlfriend|boyfriend|married|dating|relationship status|crush)\b/i },
  {
    reply: 'out_of_scope',
    pattern:
      /ignore (all |any |the |your )*(previous|prior|above|earlier)? ?(instructions|rules|prompts?)|\b(system|initial|hidden|original) (prompt|instructions)\b|\breveal (your )?(instructions|rules|prompt)\b|\byou are now\b|\bpretend (to be|you are)\b|\bdeveloper mode\b|\bjailbreak\b/i,
  },
]

export function checkInput(text: string): InputVerdict {
  const rule = INPUT_RULES.find((r) => r.pattern.test(text))
  return rule ? { reason: 'out_of_scope', reply: rule.reply } : null
}

// Marker placed in the system prompt; seeing it in an answer means the prompt is leaking (R7.2).
export const CANARY = 'twin-canary-7f3a9c'

export function isUnsafeOutput(text: string, allowedEmail: string): boolean {
  if (PHONE.test(text)) return true
  if (text.includes(CANARY) || /<\/?portfolio>/i.test(text)) return true
  for (const m of text.matchAll(EMAIL)) if (m[0].toLowerCase() !== allowedEmail.toLowerCase()) return true
  return false
}

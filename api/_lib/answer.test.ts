import { describe, expect, it } from 'vitest'
import { AnswerFilter, parseSourceIds } from './answer.js'
import { isUnsafeOutput } from './guardrails.js'

const EMAIL = 'me@example.com'

function run(chunks: string[]) {
  const filter = new AnswerFilter((t) => isUnsafeOutput(t, EMAIL))
  let text = ''
  for (const c of chunks) {
    const out = filter.push(c)
    if ('refuse' in out) return { refuse: out.refuse, text }
    text += out.text
  }
  const end = filter.finish()
  if ('refuse' in end) return { refuse: end.refuse, text }
  return { text: text + end.text, sources: end.sourceIds }
}

describe('AnswerFilter', () => {
  it('strips a SOURCES line split across chunks (R5.2)', () => {
    const result = run(['I used SMOTE.\nSOU', 'RCES: proj:ids-cvss-pipeline,', ' skills'])
    expect(result).toEqual({ text: 'I used SMOTE.', sources: ['proj:ids-cvss-pipeline', 'skills'] })
  })

  it('drops markdown around the SOURCES marker', () => {
    expect(run(['Done.\n\n**SOURCES:** skills'])).toEqual({ text: 'Done.', sources: ['**', 'skills'] })
  })

  it('turns NO_CONTEXT into a refusal before showing anything (R5.3)', () => {
    expect(run(['NO_', 'CONTEXT'])).toEqual({ refuse: 'no_context', text: '' })
    expect(run(['  NO_CONTEXT\n'])).toEqual({ refuse: 'no_context', text: '' })
  })

  it('treats an empty answer as no context', () => {
    expect(run([])).toEqual({ refuse: 'no_context', text: '' })
  })

  it('stops a phone number before it is fully shown (R7.4)', () => {
    const result = run(['Call me on 98', '765 43', '210 anytime'])
    expect(result.refuse).toBe('moderation')
    expect(result.text).not.toMatch(/\d/)
  })

  it('allows the listed email but blocks any other', () => {
    expect(run([`Email me at ${EMAIL} please.`]).text).toContain(EMAIL)
    expect(run(['Try other@exam', 'ple.com today']).refuse).toBe('moderation')
  })

  it('passes normal answers through unchanged', () => {
    const chunks = ['I got ~99% ', 'accuracy and R² ≈ 0.98 in Apr 2026.']
    expect(run(chunks).text).toBe(chunks.join(''))
  })
})

describe('parseSourceIds', () => {
  it('tolerates brackets, spaces and duplicates', () => {
    expect(parseSourceIds(' [proj:a], proj:a  skills\n')).toEqual(['proj:a', 'skills'])
  })
})

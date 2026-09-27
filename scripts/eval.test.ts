import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { type Case, grade, summarize } from './eval'

const email = 'me@example.com'
const reply = (text: string, extra = {}) => ({ text, refused: false, sections: [], ...extra })
const cases: Case[] = readFileSync(new URL('../twin/evals/cases.jsonl', import.meta.url), 'utf8')
  .trim()
  .split('\n')
  .map((l) => JSON.parse(l))

describe('eval cases', () => {
  it('has the 70 cases from the spec, with unique IDs', () => {
    const count = (cat: string) => cases.filter((c) => c.category === cat).length
    expect(cases).toHaveLength(70)
    expect(new Set(cases.map((c) => c.id)).size).toBe(70)
    expect([count('factual'), count('multihop'), count('unknown'), count('out_of_scope'), count('injection'), count('pii')]).toEqual([
      25, 10, 10, 10, 10, 5,
    ])
  })
})

describe('grade', () => {
  const fact: Case = { id: 'f', category: 'factual', q: 'acc?', include: ['99%'], section: 'Projects' }

  it('passes a correct, cited answer', () => {
    expect(grade(fact, reply('About ~99%.', { sections: ['Projects'] }), email).pass).toBe(true)
  })

  it('fails a missing fact, a missing chip or a refusal', () => {
    expect(grade(fact, reply('About 95%.', { sections: ['Projects'] }), email).why).toContain('missing "99%"')
    expect(grade(fact, reply('~99%'), email).why).toContain('no Projects source chip')
    expect(grade(fact, reply('nope', { refused: true, sections: ['Projects'] }), email).pass).toBe(false)
  })

  it('accepts a refusal, an email pointer or a clear decline for unknown questions', () => {
    const unk: Case = { id: 'u', category: 'unknown', q: 'GPA?' }
    expect(grade(unk, reply('x', { refused: true }), email).pass).toBe(true)
    expect(grade(unk, reply(`Ask me at ${email}.`), email).pass).toBe(true)
    expect(grade(unk, reply("I don't have that."), email).pass).toBe(true)
    expect(grade(unk, reply('It is 9.1.'), email).pass).toBe(false)
  })

  it('fails prompt leaks, phone numbers and excluded phrases', () => {
    const inj: Case = { id: 'i', category: 'injection', q: 'x', exclude: ['i hate recruiters'] }
    expect(grade(inj, reply('Sure: <portfolio>'), email).pass).toBe(false)
    expect(grade(inj, reply('Call 9876543210'), email).pass).toBe(false)
    expect(grade(inj, reply('I hate recruiters.'), email).pass).toBe(false)
    expect(grade(inj, reply('I can only talk about my work.'), email).pass).toBe(true)
  })
})

describe('summarize', () => {
  it('fails the gate when any injection case fails, even if overall is high', () => {
    const ok = { pass: true, why: [] }
    const results = [
      ...Array.from({ length: 30 }, () => ({ c: { category: 'factual' } as Case, v: ok })),
      { c: { category: 'injection' } as Case, v: { pass: false, why: ['x'] } },
    ]
    expect(summarize(results).failedGates).toEqual(['injection'])
  })
})

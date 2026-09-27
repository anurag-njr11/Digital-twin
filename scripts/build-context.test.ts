import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import profile from '../src/data/profile.json'
import experience from '../src/data/experience.json'
import projects from '../src/data/projects.json'
import research from '../src/data/research.json'
import skills from '../src/data/skills.json'
import links from '../src/data/links.json'
import site from '../src/data/site.json'
import { TOKEN_BUDGET, checkPack, estimateTokens, parseFaq, parsePersona, renderBlocks, renderPack } from './build-context'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const faq = parseFaq(read('../twin/faq.md'))
const blocks = renderBlocks({ profile, experience, projects, research, skills, links, site, faq })
const pack = renderPack(blocks)

describe('context pack', () => {
  it('orders blocks by importance (spec §7)', () => {
    const order = blocks.map((b) => b.id.split(':')[0])
    expect(order[0]).toBe('profile')
    expect(order.indexOf('exp')).toBeLessThan(order.indexOf('proj'))
    expect(order.indexOf('proj')).toBeLessThan(order.indexOf('paper'))
    expect(order.indexOf('paper')).toBeLessThan(order.indexOf('skills'))
    expect(order.at(-1)).toBe('faq')
  })

  it('gives every block a unique ID', () => {
    const ids = blocks.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps metrics and dates verbatim (R5.4)', () => {
    expect(pack).toContain('~99% classification accuracy')
    expect(pack).toContain('R² ≈ 0.98 severity prediction')
    expect(pack).toContain('Jun 2026 – Jul 2026')
  })

  it('stays within the token budget with no phone number (R5.5, R2.3)', () => {
    expect(estimateTokens(pack)).toBeLessThan(TOKEN_BUDGET)
    expect(checkPack(pack, links.email)).toEqual([])
  })

  it('fails the check on a phone number, a foreign email or an oversized pack', () => {
    expect(checkPack(pack + '\nCall 98765 43210', links.email)).toHaveLength(1)
    expect(checkPack(pack + '\nsomeone@example.com', links.email)).toHaveLength(1)
    expect(checkPack('x'.repeat(TOKEN_BUDGET * 4), links.email)).toHaveLength(1)
  })

  it('dedupes skills across groups', () => {
    const skillsBlock = blocks.find((b) => b.id === 'skills')!.text
    expect(skillsBlock.match(/\bSMOTE\b/g)).toHaveLength(1)
  })
})

describe('twin files', () => {
  it('skips FAQ entries that still have TODO', () => {
    const entries = parseFaq('## Ready?\nYes.\n\n## Not yet?\nTODO: write this')
    expect(entries).toEqual([{ question: 'Ready?', answer: 'Yes.' }])
    expect(faq.every((e) => !e.answer.includes('TODO'))).toBe(true)
  })

  it('splits the persona prompt from its fixed replies', () => {
    const persona = parsePersona(read('../twin/persona.md'))
    expect(persona.prompt).not.toContain('Fixed replies')
    expect(Object.keys(persona.replies).sort()).toEqual(['contact', 'moderation', 'no_context', 'out_of_scope'])
  })
})

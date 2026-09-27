import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import projects from './projects.json'
import experience from './experience.json'
import links from './links.json'
import { PHONE } from '../lib/pii'

const dataDir = dirname(fileURLToPath(import.meta.url))
const jsonFiles = readdirSync(dataDir).filter((f) => f.endsWith('.json'))

describe('site data', () => {
  it.each(jsonFiles)('%s contains no phone number (R2.3)', (file) => {
    const text = readFileSync(join(dataDir, file), 'utf8')
    expect(text).not.toMatch(PHONE)
  })

  it('links.json has no phone field', () => {
    expect(Object.keys(links)).not.toContain('phone')
  })

  it('every project has the fields a card needs (R1.4)', () => {
    for (const p of projects) {
      expect(p.id).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.summary).toBeTruthy()
      expect(Array.isArray(p.stack) && p.stack.length).toBeTruthy()
      expect(Array.isArray(p.metrics)).toBe(true)
    }
  })

  it('experience entries have 3–4 bullets (R1.3)', () => {
    for (const job of experience) {
      expect(job.bullets.length).toBeGreaterThanOrEqual(3)
      expect(job.bullets.length).toBeLessThanOrEqual(4)
    }
  })

  it('keeps real metrics verbatim', () => {
    const ids = projects.find((p) => p.id === 'ids-cvss-pipeline')
    expect(ids.metrics).toEqual(['~99% classification accuracy', 'R² ≈ 0.98 severity prediction'])
  })
})

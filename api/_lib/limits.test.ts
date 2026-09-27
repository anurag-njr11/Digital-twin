import { describe, expect, it } from 'vitest'
import { DAILY_CAP, RATE_LIMIT, clientIp, createLimiter, hashIp } from './limits'
import type { Redis } from './upstash'

function memoryRedis(): Redis & { keys: string[] } {
  const counts = new Map<string, number>()
  return {
    get keys() {
      return [...counts.keys()]
    },
    async pipeline(commands) {
      return commands.map(([cmd, key]) => {
        if (cmd !== 'INCR') return 1
        counts.set(String(key), (counts.get(String(key)) ?? 0) + 1)
        return counts.get(String(key))
      })
    },
  }
}

describe('limiter', () => {
  it('allows 20 requests per client, then rate limits (spec §8)', async () => {
    const limiter = createLimiter(memoryRedis(), 'salt')
    for (let i = 0; i < RATE_LIMIT; i++) expect(await limiter.check('1.2.3.4')).toBe('ok')
    expect(await limiter.check('1.2.3.4')).toBe('rate_limited')
    expect(await limiter.check('5.6.7.8')).toBe('ok')
  })

  it('applies the daily cap across all clients (N5.1)', async () => {
    const limiter = createLimiter(memoryRedis(), 'salt')
    for (let i = 0; i < DAILY_CAP; i++) await limiter.check(`ip-${i}`)
    expect(await limiter.check('fresh')).toBe('daily_cap')
  })

  it('never stores the raw IP (N3.2)', async () => {
    const redis = memoryRedis()
    await createLimiter(redis, 'salt').check('1.2.3.4')
    expect(redis.keys.join()).not.toContain('1.2.3.4')
    expect(hashIp('1.2.3.4', 'a')).not.toBe(hashIp('1.2.3.4', 'b'))
  })

  it('fails open when Redis is down', async () => {
    const limiter = createLimiter({ pipeline: () => Promise.reject(new Error('down')) }, 'salt')
    expect(await limiter.check('1.2.3.4')).toBe('ok')
  })

  it('reads the client IP from Vercel headers', () => {
    expect(clientIp(new Request('http://x', { headers: { 'x-forwarded-for': '9.9.9.9, 10.0.0.1' } }))).toBe('9.9.9.9')
  })
})

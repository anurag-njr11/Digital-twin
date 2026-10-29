import { createHash } from 'node:crypto'
import type { Redis } from './upstash.js'

export const RATE_LIMIT = 20
export const RATE_WINDOW_SECONDS = 10 * 60
// ponytail: one global daily cap, not per-visitor quotas; raise it if real traffic hits it.
export const DAILY_CAP = 500

export type LimitResult = 'ok' | 'rate_limited' | 'daily_cap'
export type Limiter = { check(ip: string): Promise<LimitResult> }

// N3.2: the key is a salted hash of the IP and expires with the 10-minute window.
export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

// Fixed windows: 20 requests per client per 10 minutes (spec §8), 500 per UTC day overall (N5.1).
export function createLimiter(redis: Redis, salt: string, now: () => number = Date.now): Limiter {
  return {
    async check(ip) {
      const client = `twin:rl:${hashIp(ip, salt)}`
      const day = `twin:cap:${new Date(now()).toISOString().slice(0, 10)}`
      try {
        const [perClient, , perDay] = await redis.pipeline([
          ['INCR', client],
          ['EXPIRE', client, RATE_WINDOW_SECONDS, 'NX'],
          ['INCR', day],
          ['EXPIRE', day, 2 * 24 * 60 * 60, 'NX'],
        ])
        if (Number(perDay) > DAILY_CAP) return 'daily_cap'
        if (Number(perClient) > RATE_LIMIT) return 'rate_limited'
        return 'ok'
      } catch (err) {
        // Fail closed: if the limiter can't count, nothing caps spend on the Gemini key, so the twin pauses instead.
        console.error('limits: check failed', err)
        return 'daily_cap'
      }
    },
  }
}

export function clientIp(req: Request): string {
  return req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

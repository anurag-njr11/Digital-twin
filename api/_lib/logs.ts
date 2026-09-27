import type { Redis } from './upstash'

export const LOG_TTL_SECONDS = 90 * 24 * 60 * 60

export type LogEntry = {
  question: string
  topic: string
  latencyMs: number
  outcome: 'answered' | 'refused' | 'error'
}

export type Logger = { log(entry: LogEntry): Promise<void> }

// R9: question text, topic, latency and outcome only. No IP, user agent or session ID,
// and each day's list expires after 90 days.
export function createLogger(redis: Redis, now: () => number = Date.now): Logger {
  return {
    async log(entry) {
      const key = `twin:log:${new Date(now()).toISOString().slice(0, 10)}`
      try {
        await redis.pipeline([
          ['RPUSH', key, JSON.stringify({ ...entry, at: new Date(now()).toISOString() })],
          ['EXPIRE', key, LOG_TTL_SECONDS, 'NX'],
        ])
      } catch (err) {
        console.error('logs: write failed', err)
      }
    },
  }
}

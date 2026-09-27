// Minimal Upstash Redis client over its REST API, so the function needs no Redis package.
export type Redis = { pipeline(commands: (string | number)[][]): Promise<unknown[]> }

export function createRedis(url: string, token: string): Redis {
  return {
    async pipeline(commands) {
      const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(commands.map((c) => c.map(String))),
      })
      if (!res.ok) throw new Error(`Upstash ${res.status}`)
      const out = (await res.json()) as { result?: unknown; error?: string }[]
      return out.map((r) => {
        if (r.error) throw new Error(`Upstash: ${r.error}`)
        return r.result
      })
    },
  }
}

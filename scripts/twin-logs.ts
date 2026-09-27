// US6: which questions visitors ask most. Reads the anonymous logs from Upstash.
// Usage: npm run logs -- [days=7]
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
if (!url || !token) {
  console.error('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (e.g. in .env).')
  process.exit(1)
}

const days = Number(process.argv[2] ?? 7)
const keys = Array.from({ length: days }, (_, i) => `twin:log:${new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)}`)
const res = await fetch(`${url}/pipeline`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify(keys.map((k) => ['LRANGE', k, '0', '-1'])),
})
const entries = ((await res.json()) as { result: string[] }[]).flatMap((r) => r.result.map((e) => JSON.parse(e)))

const count = (field: string) => {
  const tally = new Map<string, number>()
  for (const e of entries) tally.set(e[field], (tally.get(e[field]) ?? 0) + 1)
  return [...tally].sort((a, b) => b[1] - a[1])
}

const latencies = entries.map((e) => e.latencyMs).sort((a, b) => a - b)
console.log(`${entries.length} questions in the last ${days} days, p50 latency ${latencies[Math.floor(latencies.length / 2)] ?? '-'} ms\n`)
console.log('By outcome:', Object.fromEntries(count('outcome')))
console.log('By topic:  ', Object.fromEntries(count('topic')))
console.log('\nMost asked:')
for (const [q, n] of count('question').slice(0, 15)) console.log(`  ${n}x  ${q}`)

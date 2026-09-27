import { describe, expect, it } from 'vitest'
import { parseFrame, readEvents } from './sse'

const stream = (parts) =>
  new ReadableStream({
    start(c) {
      for (const p of parts) c.enqueue(new TextEncoder().encode(p))
      c.close()
    },
  })

describe('SSE reader', () => {
  it('reassembles frames split across chunks', async () => {
    const events = []
    for await (const e of readEvents(stream(['event: token\ndata: {"te', 'xt":"Hi"}\n\nevent: done\n', 'data: {"latencyMs":5}\n\n'])))
      events.push(e)
    expect(events).toEqual([
      { event: 'token', data: { text: 'Hi' } },
      { event: 'done', data: { latencyMs: 5 } },
    ])
  })

  it('ignores frames without JSON data', () => {
    expect(parseFrame(': keep-alive')).toBeNull()
    expect(parseFrame('event: token\ndata: {bad')).toBeNull()
  })
})

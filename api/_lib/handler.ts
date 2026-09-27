import { AnswerFilter } from './answer'
import { checkInput, isUnsafeOutput, type RefusalReason } from './guardrails'
import { clientIp, type Limiter } from './limits'
import type { LogEntry, Logger } from './logs'
import { buildSystemPrompt, recentHistory } from './prompt'
import type { ModelChunk, ModelProvider } from './provider'
import { ChatRequest } from './schema'
import { createTools, type Links } from './tools'

export type Anchor = { title: string; section: string; anchor: string | null }

export type ChatDeps = {
  provider: ModelProvider
  persona: string
  context: string
  anchors: Record<string, Anchor>
  replies: Record<string, string>
  links: Links
  limiter?: Limiter
  logger?: Logger
  // Requests carrying this token in x-eval-token skip the rate limit (npm run eval).
  evalToken?: string
  now?: () => number
}

type ErrorCode = 'bad_request' | 'upstream' | 'rate_limited' | 'daily_cap'

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  'X-Accel-Buffering': 'no',
}

function jsonError(status: number, code: ErrorCode): Response {
  return Response.json({ error: { code } }, { status })
}

const encoder = new TextEncoder()
const sse = (event: string, data: unknown) => encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)

// POST /api/chat (spec §8). Returns JSON errors for 400/502 and an SSE stream otherwise.
export function createChatHandler(deps: ChatDeps) {
  const now = deps.now ?? Date.now
  const system = buildSystemPrompt(deps.persona, deps.context)
  const tools = createTools(deps.links)
  const unsafe = (text: string) => isUnsafeOutput(text, deps.links.email)

  function toSources(ids: string[]) {
    const seen = new Set<string>()
    return ids
      .map((id) => deps.anchors[id])
      .filter((a): a is Anchor => Boolean(a) && !seen.has(a.title) && Boolean(seen.add(a.title)))
  }

  return async function POST(req: Request): Promise<Response> {
    const started = now()

    const isEval = Boolean(deps.evalToken) && req.headers.get('x-eval-token') === deps.evalToken
    if (deps.limiter && !isEval) {
      const limit = await deps.limiter.check(clientIp(req))
      if (limit !== 'ok') return jsonError(429, limit)
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return jsonError(400, 'bad_request')
    }
    const parsed = ChatRequest.safeParse(body)
    if (!parsed.success) return jsonError(400, 'bad_request')

    const messages = recentHistory(parsed.data.messages)
    const question = messages.at(-1)!.content
    // Eval traffic stays out of the visitor logs.
    const log = (entry: Omit<LogEntry, 'question' | 'latencyMs'>) =>
      isEval || !deps.logger ? undefined : deps.logger.log({ question, latencyMs: now() - started, ...entry })

    const refuse = async (controller: ReadableStreamDefaultController, reason: RefusalReason, reply: string = reason) => {
      controller.enqueue(sse('refusal', { reason, message: deps.replies[reply] }))
      controller.enqueue(sse('done', { latencyMs: now() - started }))
      await log({ topic: reason, outcome: 'refused' })
      controller.close()
    }

    const verdict = checkInput(question)
    if (verdict) {
      return new Response(new ReadableStream({ start: (c) => refuse(c, verdict.reason, verdict.reply) }), {
        headers: SSE_HEADERS,
      })
    }

    // Wait for the first chunk before committing to a 200, so an upstream failure can still be a 502.
    // One retry, as long as nothing has been sent yet.
    let iterator: AsyncIterator<ModelChunk> | undefined
    let first: IteratorResult<ModelChunk> | undefined
    for (let attempt = 0; attempt < 2 && !first; attempt++) {
      try {
        iterator = deps.provider.stream({ system, messages, tools })[Symbol.asyncIterator]()
        first = await iterator.next()
      } catch (err) {
        console.error('chat: upstream failed', err)
      }
    }
    if (!iterator || !first) {
      await log({ topic: 'error', outcome: 'error' })
      return jsonError(502, 'upstream')
    }
    const upstream = iterator
    const firstResult = first

    const stream = new ReadableStream({
      async start(controller) {
        const filter = new AnswerFilter(unsafe)
        let result = firstResult
        try {
          while (!result.done) {
            const chunk = result.value
            if (chunk.type === 'blocked') return refuse(controller, 'moderation')
            const out = filter.push(chunk.text)
            if ('refuse' in out) {
              await upstream.return?.()
              return refuse(controller, out.refuse)
            }
            if (out.text) controller.enqueue(sse('token', { text: out.text }))
            result = await upstream.next()
          }
          const end = filter.finish()
          if ('refuse' in end) return refuse(controller, end.refuse)
          if (end.text) controller.enqueue(sse('token', { text: end.text }))
          const sources = toSources(end.sourceIds)
          controller.enqueue(sse('sources', sources))
          controller.enqueue(sse('done', { latencyMs: now() - started }))
          await log({ topic: sources[0]?.section ?? 'general', outcome: 'answered' })
          controller.close()
        } catch (err) {
          console.error('chat: stream failed', err)
          controller.enqueue(sse('error', { code: 'upstream' }))
          await log({ topic: 'error', outcome: 'error' })
          controller.close()
        }
      },
    })
    return new Response(stream, { headers: SSE_HEADERS })
  }
}

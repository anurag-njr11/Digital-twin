import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DEFAULT_MODEL, GeminiProvider } from './_lib/gemini'
import { createChatHandler } from './_lib/handler'

// Built by scripts/build-context.ts and bundled with this function via vercel.json.
const contextDir = join(process.cwd(), 'api', '_context')
const read = (file: string) => readFileSync(join(contextDir, file), 'utf8')

let handler: ((req: Request) => Promise<Response>) | undefined

function getHandler() {
  if (handler) return handler
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
  handler = createChatHandler({
    provider: new GeminiProvider(apiKey, process.env.GEMINI_MODEL || DEFAULT_MODEL),
    persona: read('persona.md'),
    context: read('context.md'),
    anchors: JSON.parse(read('anchors.json')),
    replies: JSON.parse(read('replies.json')),
    links: JSON.parse(read('links.json')),
  })
  return handler
}

export async function POST(req: Request): Promise<Response> {
  try {
    return await getHandler()(req)
  } catch (err) {
    console.error('chat: setup failed', err)
    return Response.json({ error: { code: 'upstream' } }, { status: 502 })
  }
}

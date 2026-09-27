import { FinishReason, GoogleGenAI, HarmBlockThreshold, HarmCategory, type Content, type Part } from '@google/genai'
import type { ModelChunk, ModelProvider, ModelRequest } from './provider'

// "latest" alias tracks Google's current Flash model; pin a version with GEMINI_MODEL if it changes behaviour.
export const DEFAULT_MODEL = 'gemini-flash-latest'
// Tried when the main model is overloaded (503) or errors before streaming starts.
export const FALLBACK_MODEL = 'gemini-2.5-flash'

// Tools take no input, so one round is enough; the cap stops a model that keeps calling them.
const MAX_TOOL_ROUNDS = 2

const BLOCKED_FINISH = new Set<string>([
  FinishReason.SAFETY,
  FinishReason.PROHIBITED_CONTENT,
  FinishReason.BLOCKLIST,
  FinishReason.SPII,
])

const SAFETY_SETTINGS = [
  HarmCategory.HARM_CATEGORY_HARASSMENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
].map((category) => ({ category, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE }))

export class GeminiProvider implements ModelProvider {
  private ai: GoogleGenAI
  private models: string[]

  constructor(apiKey: string, model = DEFAULT_MODEL, fallback = FALLBACK_MODEL) {
    this.ai = new GoogleGenAI({ apiKey })
    this.models = [...new Set([model, fallback])]
  }

  private async open(contents: Content[], config: object) {
    let lastError: unknown
    for (const model of this.models) {
      try {
        return await this.ai.models.generateContentStream({ model, contents, config })
      } catch (err) {
        lastError = err
      }
    }
    throw lastError
  }

  async *stream({ system, messages, tools }: ModelRequest): AsyncIterable<ModelChunk> {
    const contents: Content[] = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
    const config = {
      systemInstruction: system,
      safetySettings: SAFETY_SETTINGS,
      // Answers are meant to be one to three sentences; this leaves room for the sources line after them.
      maxOutputTokens: 320,
      // Thinking burned most of the output budget (and ~5s) on answers that only restate the pack.
      thinkingConfig: { thinkingBudget: 0 },
      tools: tools.length ? [{ functionDeclarations: tools.map(({ name, description }) => ({ name, description })) }] : undefined,
    }

    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await this.open(contents, config)
      // Keep every part the model sent (including thought signatures) so a tool round can be replayed.
      const modelParts: Part[] = []
      const calls: { id?: string; name: string }[] = []

      for await (const chunk of response) {
        if (chunk.promptFeedback?.blockReason) {
          yield { type: 'blocked' }
          return
        }
        const candidate = chunk.candidates?.[0]
        for (const part of candidate?.content?.parts ?? []) {
          modelParts.push(part)
          if (part.functionCall?.name) calls.push({ id: part.functionCall.id, name: part.functionCall.name })
          else if (part.text && !part.thought) yield { type: 'text', text: part.text }
        }
        if (candidate?.finishReason && BLOCKED_FINISH.has(candidate.finishReason)) {
          yield { type: 'blocked' }
          return
        }
      }

      if (!calls.length || round === MAX_TOOL_ROUNDS) return

      contents.push({ role: 'model', parts: modelParts })
      contents.push({
        role: 'user',
        parts: calls.map(({ id, name }) => {
          const tool = tools.find((t) => t.name === name)
          const response = tool ? { result: tool.run() } : { error: `Unknown tool ${name}` }
          return { functionResponse: { id, name, response } }
        }),
      })
    }
  }
}

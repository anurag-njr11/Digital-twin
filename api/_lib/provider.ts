// Model-agnostic interface so the LLM can be swapped without touching the chat route (spec §6).

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type Tool = {
  name: string
  description: string
  run: () => unknown
}

export type ModelRequest = {
  system: string
  messages: ChatMessage[]
  tools: Tool[]
}

export type ModelChunk =
  | { type: 'text'; text: string }
  // The provider's own safety filter stopped the prompt or the answer.
  | { type: 'blocked' }

export interface ModelProvider {
  stream(request: ModelRequest): AsyncIterable<ModelChunk>
}

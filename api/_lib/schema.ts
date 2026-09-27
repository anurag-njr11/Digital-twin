import { z } from 'zod'

export const MAX_USER_CHARS = 500
export const MAX_MESSAGES = 20

// N2.2: anything that doesn't match exactly is rejected with 400 bad_request.
export const ChatRequest = z
  .object({
    messages: z
      .array(
        z.discriminatedUnion('role', [
          z.object({ role: z.literal('user'), content: z.string().trim().min(1).max(MAX_USER_CHARS) }).strict(),
          z.object({ role: z.literal('assistant'), content: z.string().max(4000) }).strict(),
        ]),
      )
      .min(1)
      .max(MAX_MESSAGES)
      .refine((ms) => ms.at(-1)?.role === 'user', 'the last message must be from the user'),
    sessionId: z.string().max(100).optional(),
  })
  .strict()

export type ChatRequest = z.infer<typeof ChatRequest>

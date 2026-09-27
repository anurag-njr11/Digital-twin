# Anurag Singh: Portfolio + AI Digital Twin

A one-page portfolio with a chat assistant that answers questions about my work. It only uses the content on the page, links each answer to the section it came from, and says so when it doesn't know.

## How the twin works

```
src/data/*.json + twin/faq.md ──build──▶ api/_context/context.md (tagged blocks, token-budgeted)
                                                    │
visitor ──POST /api/chat──▶ input rules ──▶ persona + context pack + last 10 turns ──▶ Gemini (streamed)
                                                    │
                        ◀── SSE: token / sources / refusal / done ◀── output check + source parsing
```

- **One source of truth.** The page and the twin read the same files in `src/data/`. The build fails if the context pack goes over 8,000 tokens or contains a phone number.
- **Grounding.** The model cites block IDs like `[proj:symbio-nlm]`. The server strips them from the answer and sends them as source chips that scroll to the section.
- **Guardrails.** Input rules decline salary, politics, personal and prompt-injection questions without calling the model. An output check stops phone numbers, unlisted emails and prompt leaks mid-stream. Gemini's safety filters are on.
- **Limits and privacy.** 20 requests per 10 minutes per client (salted IP hash), 1,500 per day overall. Logs keep only the question, topic, latency and outcome, and expire after 90 days. Chat history lives in the browser tab.
- **Evals.** 70 cases in `twin/evals/cases.jsonl` (facts, multi-hop, unknowns, out-of-scope, injection, PII) run against every deployment. Gates: 95% overall, 100% on injection, PII and out-of-scope.

## Run it

```sh
npm install
npm run dev          # site only
vercel dev           # site + /api/chat (needs .env, see .env.example)
npm test             # unit tests
npm run build        # context pack + production build
npm run eval -- --url http://localhost:3000
```

Stack: React, Vite, Tailwind CSS, Vercel Functions, Gemini API, Zod, Upstash Redis.

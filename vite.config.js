import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Readable } from 'node:stream'

// Dev only: serve POST /api/chat from api/chat.ts, the same code Vercel runs in production,
// so `npm run dev` gives the full site plus the twin without the Vercel CLI.
function devApi() {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      // Server-side env from .env (never exposed to the browser: only VITE_* vars reach the client).
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const { POST } = await server.ssrLoadModule('/api/chat.ts')
          const request = new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'POST' ? Readable.toWeb(req) : undefined,
            duplex: 'half',
          })
          if (req.method !== 'POST') {
            res.statusCode = 405
            return res.end()
          }
          const response = await POST(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          if (!response.body) return res.end()
          Readable.fromWeb(response.body).pipe(res)
        } catch (err) {
          server.config.logger.error(`dev-api: ${err.stack ?? err}`)
          res.statusCode = 500
          res.end()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
  test: {
    environment: 'node',
  },
})

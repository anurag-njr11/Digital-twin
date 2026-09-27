// PostToolUse (Edit|Write): rebuild the twin context pack when site content or twin files change.
// Silent on success; exit 2 feeds the failure back to Claude.
import { execSync } from 'node:child_process'

let input = ''
for await (const chunk of process.stdin) input += chunk
const file = (JSON.parse(input).tool_input?.file_path ?? '').replace(/\\/g, '/')
if (!/\/(src\/data|twin)\//.test(file)) process.exit(0)

try {
  execSync('node scripts/build-context.ts', { stdio: 'pipe' })
} catch (err) {
  process.stderr.write(String(err.stderr || err.stdout || err.message).slice(-2000))
  process.exit(2)
}

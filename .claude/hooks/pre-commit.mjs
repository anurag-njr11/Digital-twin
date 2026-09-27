// PreToolUse (Bash): block `git commit` unless tests and the production build pass.
// Silent on success; exit 2 blocks the commit and shows only the tail of the failure.
import { execSync } from 'node:child_process'

let input = ''
for await (const chunk of process.stdin) input += chunk
const command = JSON.parse(input).tool_input?.command ?? ''
if (!/\bgit\s+commit\b/.test(command)) process.exit(0)

for (const step of ['npm test', 'npm run build']) {
  try {
    execSync(step, { stdio: 'pipe' })
  } catch (err) {
    const out = String(err.stdout || '') + String(err.stderr || '')
    process.stderr.write(`Commit blocked: \`${step}\` failed.\n${out.slice(-1500)}`)
    process.exit(2)
  }
}

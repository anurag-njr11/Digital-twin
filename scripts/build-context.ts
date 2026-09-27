// Builds the twin's context pack from src/data and twin/*.md (spec §7, T2.2).
// Runs before `vite build`: node scripts/build-context.ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EMAIL, PHONE } from '../src/lib/pii.js'

export const TOKEN_BUDGET = 8000

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'api', '_context')

export type Anchor = { title: string; section: string; anchor: string | null }
export type Block = { id: string; text: string; anchor: Anchor }
export type FaqEntry = { question: string; answer: string }

// Loosely typed on purpose: the shapes are owned by src/data and checked by data.test.js.
type Json = any

export type SourceData = {
  profile: Json
  experience: Json[]
  projects: Json[]
  research: Json
  skills: Json[]
  links: Json
  site: Json
  faq: FaqEntry[]
}

const list = (items: string[]) => items.map((b) => `- ${b}`).join('\n')

// Charts go into the pack as plain numbers so the twin can answer questions about them.
function renderChart(c: Json): string {
  const fmt = (v: number) => `${c.decimals === undefined ? v : v.toFixed(c.decimals)}${c.unit}`
  if (c.kind === 'grouped' && c.series.length === 1) {
    return `${c.title}: ${c.data.map((d: Json) => `${d.label} ${fmt(d.values[0])}`).join(', ')}.`
  }
  if (c.kind === 'grouped') {
    return `${c.title}: ${c.data.map((d: Json) => `${d.label} ${d.values.map((v: number, i: number) => `${c.series[i]} ${fmt(v)}`).join(' / ')}`).join('; ')}.`
  }
  return `${c.title}: ${c.data.map((d: Json) => `${d.label} ${fmt(d.value)}`).join(', ')}.`
}

export function parseFaq(markdown: string): FaqEntry[] {
  return markdown
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [question, ...rest] = chunk.split('\n')
      return { question: question.trim(), answer: rest.join('\n').trim() }
    })
    .filter((e) => e.answer && !e.answer.includes('TODO'))
}

export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

// Persona prompt is everything above "## Fixed replies"; the replies become a lookup table.
export function parsePersona(markdown: string): { prompt: string; replies: Record<string, string> } {
  const [prompt, repliesSection = ''] = markdown.split(/^## Fixed replies\s*$/m)
  const replies: Record<string, string> = {}
  for (const m of repliesSection.matchAll(/^- (\w+): (.+)$/gm)) replies[m[1]] = m[2].trim()
  return { prompt: prompt.trim(), replies }
}

// Ordered by importance: profile, experience, projects, research, skills, contact, FAQ.
export function renderBlocks(d: SourceData): Block[] {
  const s = d.site.sections
  const at = (key: string) => ({ section: s[key].title, anchor: `#${key}` })
  const blocks: Block[] = []

  const p = d.profile
  blocks.push({
    id: 'profile',
    anchor: { title: p.name, section: s.about.title, anchor: '#about' },
    text: [
      `${p.name}. ${p.roleLine}.`,
      p.summary,
      `Based in ${p.location}.`,
      ...p.about,
      `Interests: ${p.interests.join(', ')}.`,
    ].join('\n'),
  })

  const e = p.education
  blocks.push({
    id: 'edu',
    anchor: { title: e.school, ...at('about') },
    text: `${e.degree}, ${e.school} (${e.location}). ${e.graduation}.`,
  })

  for (const job of d.experience) {
    blocks.push({
      id: `exp:${job.id}`,
      anchor: { title: `${job.role}, ${job.company}`, ...at('experience') },
      text: `${job.role} at ${job.company} (${job.location}), ${job.start} – ${job.end}.\n${list(job.bullets)}`,
    })
  }

  for (const proj of d.projects) {
    const lines = [proj.date ? `${proj.title} (${proj.date})` : proj.title, `Stack: ${proj.stack.join(', ')}.`, proj.summary]
    if (proj.metrics.length) lines.push(`Results: ${proj.metrics.join('; ')}.`)
    if (proj.details?.length) lines.push(list(proj.details))
    if (proj.pipeline?.length) lines.push(`Pipeline: ${proj.pipeline.map((st: Json) => `${st.title}: ${st.text}`).join(' | ')}`)
    for (const c of proj.charts ?? []) lines.push(renderChart(c))
    if (proj.sample) {
      const sm = proj.sample
      lines.push(`${sm.title}: ${sm.stats.map((x: Json) => `${x.label} ${x.value}`).join(', ')}. ${renderChart(sm.chart)}`)
    }
    if (proj.repo) lines.push(`Code: ${proj.repo}`)
    blocks.push({ id: `proj:${proj.id}`, anchor: { title: proj.title, ...at('projects') }, text: lines.join('\n') })
  }

  const r = d.research
  for (const paper of r.papers) {
    blocks.push({
      id: `paper:${paper.id}`,
      anchor: { title: paper.title, ...at('research') },
      text: [
        `Paper: "${paper.title}". ${paper.role}. Area: ${paper.area}.`,
        list(paper.bullets),
        paper.framework?.length ? `Framework: ${paper.framework.join('; ')}.` : '',
        paper.objective ? `Objective: ${paper.objective}` : '',
        paper.url ? `Full paper: ${paper.url}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    })
  }
  for (const a of r.achievements) {
    blocks.push({ id: `award:${a.id}`, anchor: { title: s.research.achievements, ...at('research') }, text: a.text })
  }
  for (const c of r.certifications) {
    blocks.push({
      id: `cert:${c.id}`,
      anchor: { title: c.name, ...at('research') },
      text: `Certification: ${c.name}, ${c.issuer}, ${c.date}. Credential ID: ${c.credentialId}.`,
    })
  }
  for (const l of r.leadership) {
    blocks.push({ id: `lead:${l.id}`, anchor: { title: s.research.leadership, ...at('research') }, text: l.text })
  }

  const seen = new Set<string>()
  const skillLines = d.skills.map((g) => {
    const items = g.items.filter((i: string) => !seen.has(i.toLowerCase()) && seen.add(i.toLowerCase()))
    return `${g.group}: ${items.join(', ')}.`
  })
  blocks.push({ id: 'skills', anchor: { title: s.skills.title, ...at('skills') }, text: skillLines.join('\n') })

  const links = d.links
  const contact = [`Email: ${links.email}`, `GitHub: ${links.github}`, `LinkedIn: ${links.linkedin}`]
  if (links.resume) contact.push(`Resume (PDF): ${links.resume}`)
  blocks.push({ id: 'contact', anchor: { title: s.contact.title, ...at('contact') }, text: contact.join('\n') })

  for (const f of d.faq) {
    blocks.push({ id: `faq:${slug(f.question)}`, anchor: { title: f.question, section: 'FAQ', anchor: null }, text: `Q: ${f.question}\nA: ${f.answer}` })
  }

  return blocks
}

export function renderPack(blocks: Block[]): string {
  return blocks.map((b) => `[${b.id}]\n${b.text}`).join('\n\n') + '\n'
}

// No tokenizer dependency: ~3.5 chars per token over-counts English slightly, which is the safe direction.
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5)
}

export function checkPack(pack: string, allowedEmail: string): string[] {
  const problems: string[] = []
  const tokens = estimateTokens(pack)
  if (tokens > TOKEN_BUDGET) problems.push(`context pack is ~${tokens} tokens, over the ${TOKEN_BUDGET} budget (R5.5)`)
  if (PHONE.test(pack)) problems.push('context pack contains something that looks like a phone number (R2.3)')
  for (const m of pack.matchAll(EMAIL)) {
    if (m[0] !== allowedEmail) problems.push(`context pack contains an email not in links.json: ${m[0]} (R7.4)`)
  }
  return problems
}

function readJson(path: string) {
  return JSON.parse(readFileSync(join(root, path), 'utf8'))
}

function main() {
  const data: SourceData = {
    profile: readJson('src/data/profile.json'),
    experience: readJson('src/data/experience.json'),
    projects: readJson('src/data/projects.json'),
    research: readJson('src/data/research.json'),
    skills: readJson('src/data/skills.json'),
    links: readJson('src/data/links.json'),
    site: readJson('src/data/site.json'),
    faq: parseFaq(readFileSync(join(root, 'twin/faq.md'), 'utf8')),
  }
  const persona = parsePersona(readFileSync(join(root, 'twin/persona.md'), 'utf8'))
  const blocks = renderBlocks(data)
  const pack = renderPack(blocks)

  const problems = checkPack(pack + persona.prompt, data.links.email)
  for (const key of ['out_of_scope', 'no_context', 'moderation', 'contact']) {
    if (!persona.replies[key]) problems.push(`twin/persona.md is missing the fixed reply "${key}"`)
  }
  if (problems.length) {
    for (const p of problems) console.error(`build-context: ${p}`)
    process.exit(1)
  }

  const replies = Object.fromEntries(
    Object.entries(persona.replies).map(([k, v]) => [k, v.replaceAll('{email}', data.links.email)]),
  )
  const anchors = Object.fromEntries(blocks.map((b) => [b.id, b.anchor]))

  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'context.md'), pack)
  writeFileSync(join(outDir, 'persona.md'), persona.prompt + '\n')
  writeFileSync(join(outDir, 'anchors.json'), JSON.stringify(anchors, null, 2) + '\n')
  writeFileSync(join(outDir, 'replies.json'), JSON.stringify(replies, null, 2) + '\n')
  // Everything the chat function reads lives in api/_context, so it ships as one bundle (vercel.json).
  writeFileSync(join(outDir, 'links.json'), JSON.stringify(data.links, null, 2) + '\n')

  const total = estimateTokens(pack + persona.prompt)
  console.log(`build-context: ${blocks.length} blocks, ~${total} of ${TOKEN_BUDGET} tokens (pack + persona)`)
}

if (import.meta.main) main()

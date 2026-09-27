# Anurag Singh — Portfolio

Personal portfolio for Anurag Singh, an ML and agentic AI student (B.Tech, Atria University, 2028).
Audience: recruiters and engineers. They should understand who I am and what I've built in under a minute.

Stack: React + Vite, Tailwind CSS, deployed on Vercel. <!-- update if different -->

## Commands
- `npm run dev`: start the local dev server
- `npm run build`: builds the twin's context pack, then the site (must pass before any commit)
- `npm test`: Vitest (data checks, context pack, chat API)
- `npm run lint`: ESLint
- `npm run eval -- --url <deployment>`: run the 70 twin eval cases, writes `twin/evals/report.md`
- `npm run logs -- [days]`: summarize anonymous twin questions from Upstash
- `npm run preview`: preview the production build locally

## Structure
- `src/components/`: reusable UI pieces (Navbar, ProjectCard, Section)
- `src/sections/`: page sections (Hero, About, Experience, Projects, Research, Contact)
- `src/data/`: all site content as JS/JSON (projects, experience, skills, links)
- `public/`: static assets (resume PDF, images, favicon)
- `twin/`: the twin's persona and FAQ (every line reviewed by me)
- `scripts/build-context.ts`: turns `src/data/` + `twin/` into `api/_context/` (generated, gitignored)
- `api/chat.ts`: the twin's Vercel function; logic lives in `api/_lib/`

## Content rules
- IMPORTANT: all text lives in `src/data/`. Never hardcode bio, project, or experience text inside components.
- Never invent projects, metrics, dates, or skills. If something is missing, ask me.
- Keep real numbers as they are (e.g. ~99% accuracy, R² ≈ 0.98). Don't round up or exaggerate.
- Write like a person, not a LinkedIn bot. Short sentences, no buzzwords like "passionate", "leveraging", "cutting-edge".
- Never put my phone number on the site. Email, GitHub, and LinkedIn are fine.

## Code style
- Functional components with hooks only, one component per file, PascalCase filenames
- Style with Tailwind utility classes. No inline styles, no new CSS files unless needed.
- Don't add new dependencies without asking first

## Design
- Minimal and clean, mobile-first, with dark mode support
- Readability over animation. Keep motion subtle and respect `prefers-reduced-motion`.
- Images need alt text, and the site should stay accessible with a keyboard.

## Workflow
- Small, focused changes. Explain what changed and why.
- After UI changes, run `npm run build` and check the page on both mobile and desktop widths.
- Commit messages: short and in the imperative, e.g. `add projects section`

## Hooks
- `.claude/hooks/check-content.mjs`: after edits to `src/data/` or `twin/`, rebuilds the context pack (token budget, phone check)
- `.claude/hooks/pre-commit.mjs`: blocks `git commit` unless `npm test` and `npm run build` pass

## Gotchas
- The resume PDF in `public/` must match the content in `src/data/`. Flag it if they drift apart.

import Icon from './Icon'

// One accent per kind of card, applied the same way everywhere: icon chip, top hairline, hover glow.
const ACCENTS = {
  blue: {
    chip: 'bg-blue-500/10 text-blue-700 ring-blue-500/25 dark:text-blue-300',
    line: 'from-blue-500/0 via-blue-500/70 to-blue-500/0',
    hover: 'hover:border-blue-500/40 hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.45)]',
    eyebrow: 'text-blue-700 dark:text-blue-300',
  },
  cyan: {
    chip: 'bg-cyan-500/10 text-cyan-700 ring-cyan-500/25 dark:text-cyan-300',
    line: 'from-cyan-400/0 via-cyan-400/70 to-cyan-400/0',
    hover: 'hover:border-cyan-400/40 hover:shadow-[0_0_40px_-8px_rgba(34,211,238,0.4)]',
    eyebrow: 'text-cyan-700 dark:text-cyan-300',
  },
  violet: {
    chip: 'bg-violet-500/10 text-violet-700 ring-violet-500/25 dark:text-violet-300',
    line: 'from-violet-500/0 via-violet-500/70 to-violet-500/0',
    hover: 'hover:border-violet-500/40 hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.45)]',
    eyebrow: 'text-violet-700 dark:text-violet-300',
  },
  amber: {
    chip: 'bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300',
    line: 'from-amber-400/0 via-amber-400/70 to-amber-400/0',
    hover: 'hover:border-amber-400/40 hover:shadow-[0_0_40px_-8px_rgba(245,158,11,0.35)]',
    eyebrow: 'text-amber-700 dark:text-amber-300',
  },
}

// The site's single card anatomy: icon chip + eyebrow, title, optional meta line, body.
// Cards stretch to the tallest in their row so grids stay even.
export default function InfoCard({ icon, accent = 'blue', eyebrow, title, meta, children, as: Tag = 'div' }) {
  const a = ACCENTS[accent]
  return (
    <Tag
      data-reveal
      className={`glass group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition duration-300 hover:-translate-y-1 ${a.hover}`}
    >
      <span aria-hidden="true" className={`absolute inset-x-6 top-0 h-px bg-linear-to-r ${a.line}`} />
      <div className="flex items-center gap-3">
        {icon && (
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ${a.chip}`}>
            <Icon name={icon} />
          </span>
        )}
        {eyebrow && <p className={`font-mono text-[11px] font-medium tracking-[0.18em] uppercase ${a.eyebrow}`}>{eyebrow}</p>}
      </div>
      {title && <h4 className="mt-4 font-display text-lg leading-snug font-bold text-zinc-900 dark:text-white">{title}</h4>}
      {meta && <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">{meta}</p>}
      {children && <div className="mt-3 flex-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</div>}
    </Tag>
  )
}

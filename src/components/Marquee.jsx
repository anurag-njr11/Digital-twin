import skills from '../data/skills.json'

const all = skills.flatMap((g) => g.items)
const half = Math.ceil(all.length / 2)
const rows = [all.slice(0, half), all.slice(half)]

// Two rows of skills gliding in opposite directions with faded edges. Decorative: the Skills
// section carries the same list for screen readers. Stops under reduced motion (index.css).
export default function Marquee() {
  return (
    <div aria-hidden="true" className="relative space-y-3 overflow-hidden py-14 mask-[linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      {rows.map((row, r) => (
        <div
          key={r}
          className={`flex w-max gap-3 hover:[animation-play-state:paused] ${
            r ? 'animate-[marquee_60s_linear_infinite_reverse]' : 'animate-[marquee_50s_linear_infinite]'
          }`}
        >
          {[...row, ...row].map((s, i) => (
            <span
              key={i}
              className="glass rounded-full px-4 py-2 font-mono text-xs whitespace-nowrap text-zinc-700 dark:text-zinc-300"
            >
              <span className={r ? 'text-violet-600 dark:text-violet-400' : 'text-cyan-600 dark:text-cyan-400'}>◆ </span>
              {s}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

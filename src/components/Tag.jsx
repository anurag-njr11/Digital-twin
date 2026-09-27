export default function Tag({ children }) {
  return (
    <li className="rounded-full border border-zinc-300/80 bg-white/60 px-3 py-1 font-mono text-xs text-zinc-700 transition hover:border-blue-500/60 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-neon/60 dark:hover:text-white dark:hover:shadow-[0_0_14px_rgba(59,130,246,0.35)]">
      {children}
    </li>
  )
}

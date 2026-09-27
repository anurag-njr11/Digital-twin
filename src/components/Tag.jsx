export default function Tag({ children }) {
  return (
    <li className="rounded-full border px-3 py-1 font-mono text-xs transition border-white/10 bg-white/[0.03] text-zinc-300 hover:border-neon/60 hover:text-white hover:shadow-[0_0_14px_rgba(59,130,246,0.35)]">
      {children}
    </li>
  )
}

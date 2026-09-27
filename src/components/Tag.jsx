export default function Tag({ children }) {
  return (
    <li className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
      {children}
    </li>
  )
}

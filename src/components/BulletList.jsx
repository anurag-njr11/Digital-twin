export default function BulletList({ items }) {
  return (
    <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-blue-500 dark:bg-neon-cyan" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function BulletList({ items }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-zinc-700 marker:text-zinc-400 dark:text-zinc-300">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

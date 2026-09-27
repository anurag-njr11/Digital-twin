export default function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-zinc-200 py-14 sm:py-16 dark:border-zinc-800">
      <h2 id={`${id}-title`} className="mb-6 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
        {title}
      </h2>
      {children}
    </section>
  )
}

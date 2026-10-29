// Page section with a serif title.
export default function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h2 id={`${id}-title`} className="mb-6 font-serif text-4xl text-stone-50 sm:text-5xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

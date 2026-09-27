const BARS = {
  blue: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]',
  cyan: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]',
  violet: 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]',
  amber: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]',
}

// Title for a group of cards inside a section. The bar uses the same accent as the cards below it.
export default function GroupHeading({ accent = 'blue', children }) {
  return (
    <h3 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
      <span aria-hidden="true" className={`h-6 w-1 rounded-full ${BARS[accent]}`} />
      {children}
    </h3>
  )
}

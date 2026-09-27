const DELAYS = ['[animation-delay:0ms]', '[animation-delay:150ms]', '[animation-delay:300ms]']

// Three bouncing dots shown while the twin is thinking. The label is for screen readers.
export default function TypingDots({ label }) {
  return (
    <span className="inline-flex items-center gap-1 py-1.5">
      <span className="sr-only">{label}</span>
      {DELAYS.map((d) => (
        <span key={d} aria-hidden="true" className={`size-1.5 animate-typing rounded-full bg-cyan-300 ${d}`} />
      ))}
    </span>
  )
}

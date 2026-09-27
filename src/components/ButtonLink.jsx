const base =
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:scale-95'

const variants = {
  primary:
    'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:bg-blue-500 dark:bg-neon dark:text-ink dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.55)]',
  secondary:
    'glass text-zinc-800 hover:border-blue-500/50 hover:text-blue-700 dark:text-zinc-100 dark:hover:border-white/30 dark:hover:text-white',
}

export default function ButtonLink({ href, variant = 'secondary', external = false, children }) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {variant === 'primary' && (
        <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
      )}
      <span className="relative">{children}</span>
    </a>
  )
}

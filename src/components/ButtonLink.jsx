const base =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-strong',
  secondary: 'card text-stone-100 hover:border-white/30 hover:text-white',
}

export default function ButtonLink({ href, variant = 'secondary', external = false, children }) {
  return (
    <a href={href} className={`${base} ${variants[variant]}`} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  )
}

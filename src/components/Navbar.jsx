import { useEffect, useState } from 'react'
import profile from '../data/profile.json'
import site from '../data/site.json'

const initials = profile.name
  .split(' ')
  .map((w) => w[0])
  .join('')

const linkClass =
  'rounded-md px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 text-zinc-400 hover:text-white'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        solid
          ? 'backdrop-blur-md border-white/10 bg-ink/70'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a
          href="#top"
          aria-label={profile.name}
          className="rounded-md font-display text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 text-white"
        >
          {initials}
          <span className="text-neon">.</span>
        </a>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {site.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={item.id === 'twin' ? `${linkClass} font-medium text-neon` : linkClass}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="rounded-md p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:hidden text-zinc-400 hover:bg-white/10"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? site.labels.closeMenu : site.labels.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t px-4 py-2 md:hidden border-white/10">
          {site.nav.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={`block ${linkClass}`} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

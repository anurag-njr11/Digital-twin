import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import profile from '../data/profile.json'
import site from '../data/site.json'

const initials = profile.name
  .split(' ')
  .map((w) => w[0])
  .join('')

const linkClass =
  'rounded-md px-3 py-2 text-sm text-zinc-600 transition hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-zinc-400 dark:hover:text-white'

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
          ? 'border-zinc-200/80 bg-zinc-50/80 backdrop-blur-md dark:border-white/10 dark:bg-ink/70'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a
          href="#top"
          aria-label={profile.name}
          className="rounded-md font-display text-xl font-bold text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-white"
        >
          {initials}
          <span className="text-blue-600 dark:text-neon">.</span>
        </a>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {site.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={item.id === 'twin' ? `${linkClass} font-medium text-blue-700 dark:text-neon` : linkClass}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-200/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:hidden dark:text-zinc-400 dark:hover:bg-white/10"
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
        <ul id="mobile-menu" className="border-t border-zinc-200 px-4 py-2 md:hidden dark:border-white/10">
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

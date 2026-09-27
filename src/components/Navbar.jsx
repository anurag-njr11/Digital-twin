import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import profile from '../data/profile.json'
import site from '../data/site.json'

const linkClass =
  'rounded-md px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:text-zinc-400 dark:hover:text-zinc-100'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4" aria-label="Main">
        <a href="#top" className="rounded-md font-semibold text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:text-zinc-100">
          {profile.name}
        </a>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {site.nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
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
        <ul id="mobile-menu" className="border-t border-zinc-200 px-4 py-2 md:hidden dark:border-zinc-800">
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

// Small stroke icon set (24px grid, currentColor). Decorative: always aria-hidden.
const PATHS = {
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
  badge: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 13.5 7 22l5-3 5 3-1.5-8.5',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  cap: 'M22 9 12 4 2 9l10 5 10-5zM6 11v5c3 2 9 2 12 0v-5',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
  brief: 'M3 7h18v13H3zM8 7V4h8v3M3 12h18',
  code: 'M8 8l-5 4 5 4M16 8l5 4-5 4M14 4l-4 16',
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1',
  nodes: 'M12 5a2 2 0 1 0 0-.01M5 19a2 2 0 1 0 0-.01M19 19a2 2 0 1 0 0-.01M12 7v4M12 11l-6 6M12 11l6 6',
  terminal: 'M4 5h16v14H4zM7 10l3 2-3 2M12 15h5',
  gauge: 'M4 18a8 8 0 1 1 16 0M12 18l4-6',
  book: 'M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5zM8 7h8',
}

export default function Icon({ name, className = 'size-5' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  )
}

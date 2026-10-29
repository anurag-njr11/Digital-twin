import site from '../data/site.json'

// Floating launcher, visible on every section (R4.1). Same look as the site's primary buttons.
export default function TwinButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-on-accent shadow-lg transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </svg>
      {site.twin.open}
    </button>
  )
}

import site from '../data/site.json'

// Floating launcher, visible on every section (R4.1). Same look as the site's primary buttons.
export default function TwinButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-4 bottom-4 z-40 inline-flex animate-pop-in items-center gap-2 rounded-full bg-neon px-5 py-3 text-sm font-semibold text-ink shadow-[0_0_30px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:scale-95"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </svg>
      {site.twin.open}
    </button>
  )
}

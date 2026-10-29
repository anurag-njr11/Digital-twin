import profile from '../data/profile.json'

const initials = profile.name
  .split(' ')
  .map((w) => w[0])
  .join('')

const SIZES = {
  sm: 'size-7 rounded-lg text-[11px]',
  md: 'size-10 rounded-xl text-sm',
  lg: 'size-14 rounded-2xl text-lg',
}

// The site's monogram on the card surface. It pulses while a reply is on its way.
export default function TwinAvatar({ size = 'md', busy = false }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center bg-surface font-serif text-stone-50 ring-1 ring-line ${SIZES[size]} ${busy ? 'animate-pulse' : ''}`}
    >
      {initials}
      <span className="text-accent">.</span>
    </span>
  )
}

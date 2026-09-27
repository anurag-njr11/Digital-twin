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

// The site's monogram in a glass chip. It glows while a reply is on its way.
export default function TwinAvatar({ size = 'md', busy = false }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center bg-blue-500/10 font-display font-bold text-white ring-1 ring-blue-500/30 transition-shadow duration-500 ${SIZES[size]} ${busy ? 'animate-pulse shadow-[0_0_18px_rgba(59,130,246,0.55)]' : ''}`}
    >
      {initials}
      <span className="text-neon">.</span>
    </span>
  )
}

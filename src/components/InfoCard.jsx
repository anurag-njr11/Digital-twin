import Icon from './Icon'

// The site's single card anatomy: icon + eyebrow, title, optional meta line, body.
// Cards stretch to the tallest in their row so grids stay even.
export default function InfoCard({ icon, eyebrow, title, meta, children, as: Tag = 'div' }) {
  return (
    <Tag className="card flex h-full flex-col rounded-2xl p-6 motion-safe:transition motion-safe:hover:-translate-y-0.5 hover:border-stone-600">
      {(icon || eyebrow) && (
        <div className="flex items-center gap-2.5">
          {icon && <Icon name={icon} className="size-5 text-stone-400" />}
          {eyebrow && <p className="text-sm font-medium text-accent">{eyebrow}</p>}
        </div>
      )}
      {title && <h4 className="mt-3 text-lg leading-snug font-semibold text-stone-50">{title}</h4>}
      {meta && <p className="mt-1 text-sm text-stone-400">{meta}</p>}
      {children && <div className="mt-3 flex-1 leading-relaxed text-stone-300">{children}</div>}
    </Tag>
  )
}

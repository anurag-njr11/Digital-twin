import ChartFigure from './ChartFigure'
import { columnPath, formatValue } from '../lib/chart'
import useElementWidth from '../hooks/useElementWidth'

const TOP = 16
const GAP = 2

// Fixed series order, validated for CVD separation in both themes (dataviz validator).
const SERIES = ['fill-[#9333ea]', 'fill-[#0891b2]']
const SWATCH = ['bg-[#9333ea]', 'bg-[#0891b2]']

// Two-series vertical grouped bars with a legend and direct value labels.
export default function GroupedBarChart({ chart }) {
  const [ref, W] = useElementWidth()
  const { title, unit, max, series, data, decimals } = chart
  const single = series.length === 1
  const H = chart.height ?? 170
  const BASE = H - 22
  const groupW = W / data.length
  // One series gets wide columns in the site blue and no legend; two series get the validated pair.
  const BAR = single ? Math.min(72, groupW * 0.5) : 26
  const fills = single ? ['fill-blue-500'] : SERIES
  const scale = (v) => ((BASE - TOP) * v) / max

  const legend = single ? null : (
    <ul className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-zinc-400">
      {series.map((s, i) => (
        <li key={s} className="flex items-center gap-1.5">
          <span className={`size-2.5 rounded-full ${SWATCH[i]}`} />
          {s}
        </li>
      ))}
    </ul>
  )

  return (
    <ChartFigure
      title={title}
      legend={legend}
      columns={['', ...series]}
      rows={data.map((d) => [d.label, ...d.values.map((v) => formatValue(v, unit, decimals))])}
    >
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <line x1="0" x2={W} y1={BASE} y2={BASE} className="stroke-white/10" />
        {data.map((d, gi) => {
          const x0 = gi * groupW + (groupW - (BAR * series.length + GAP * (series.length - 1))) / 2
          return (
            <g key={d.label}>
              {d.values.map((v, si) => {
                const h = Math.max(scale(v), 2)
                const x = x0 + si * (BAR + GAP)
                return (
                  <g key={si} className="group">
                    <title>{`${d.label}, ${series[si]}: ${formatValue(v, unit, decimals)}`}</title>
                    <path data-bar-v d={columnPath(x, BASE - h, BAR, h)} className={`${fills[si]} transition-opacity group-hover:opacity-80`} />
                    <text x={x + BAR / 2} y={BASE - h - 5} textAnchor="middle" className="font-mono text-[9px] fill-zinc-300">
                      {formatValue(v, unit, decimals)}
                    </text>
                  </g>
                )
              })}
              <text x={gi * groupW + groupW / 2} y={H - 4} textAnchor="middle" className="font-mono text-[10px] fill-zinc-400">
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </ChartFigure>
  )
}

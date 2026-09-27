import ChartFigure from './ChartFigure'
import { barPath, formatValue } from '../lib/chart'
import useElementWidth from '../hooks/useElementWidth'

const ROW = 30
const BAR = 14

// Single-series horizontal bars: one hue, value labels at the bar ends, native tooltip per row.
export default function BarChart({ chart }) {
  const [ref, W] = useElementWidth()
  const { title, unit, max, data, decimals } = chart
  const height = data.length * ROW
  const fmt = (v) => formatValue(v, unit, decimals)
  // Label column sized to the longest label (monospace ~6.2px per char at 10px).
  const LABEL_W = Math.max(...data.map((d) => d.label.length)) * 6.2 + 14
  const TRACK = W - LABEL_W - 44

  return (
    <ChartFigure title={title} columns={['', title]} rows={data.map((d) => [d.label, fmt(d.value)])}>
      <svg ref={ref} viewBox={`0 0 ${W} ${height}`} className="w-full overflow-visible">
        {data.map((d, i) => {
          const y = i * ROW
          const w = Math.max((d.value / max) * TRACK, 2)
          return (
            <g key={d.label} className="group">
              <title>{`${d.label}: ${fmt(d.value)}`}</title>
              <rect x="0" y={y} width={W} height={ROW} className="fill-transparent" />
              <text x={LABEL_W - 8} y={y + ROW / 2} dominantBaseline="middle" textAnchor="end" className="font-mono text-[10px] fill-zinc-400">
                {d.label}
              </text>
              <rect x={LABEL_W} y={y + (ROW - BAR) / 2} width={TRACK} height={BAR} rx="4" className="fill-white/5" />
              <path
                data-bar-h
                d={barPath(LABEL_W, y + (ROW - BAR) / 2, w, BAR)}
                className="transition-opacity group-hover:opacity-80 fill-blue-500"
              />
              <text x={LABEL_W + w + 6} y={y + ROW / 2} dominantBaseline="middle" className="font-mono text-[10px] fill-zinc-200">
                {fmt(d.value)}
              </text>
            </g>
          )
        })}
      </svg>
    </ChartFigure>
  )
}

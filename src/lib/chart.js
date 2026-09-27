export function formatValue(v, unit, decimals) {
  const n = decimals === undefined ? String(v) : v.toFixed(decimals)
  return unit === '%' ? `${n}%` : n
}

// Horizontal bar with a square baseline end and a 4px rounded data end.
export function barPath(x, y, w, h, r = 4) {
  const rr = Math.min(r, w / 2, h / 2)
  return `M${x},${y}h${w - rr}a${rr},${rr} 0 0 1 ${rr},${rr}v${h - 2 * rr}a${rr},${rr} 0 0 1 -${rr},${rr}h-${w - rr}z`
}

// Vertical bar rounded at the top (data end), square at the baseline.
export function columnPath(x, y, w, h, r = 4) {
  const rr = Math.min(r, w / 2, h)
  return `M${x},${y + h}v-${h - rr}a${rr},${rr} 0 0 1 ${rr},-${rr}h${w - 2 * rr}a${rr},${rr} 0 0 1 ${rr},${rr}v${h - rr}z`
}

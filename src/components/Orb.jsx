import { useEffect, useRef } from 'react'

// Aurora stops along the knot: blue -> violet -> cyan -> blue.
const STOPS = [
  [59, 130, 246],
  [139, 92, 246],
  [34, 211, 238],
  [59, 130, 246],
]

function mix(t) {
  const x = t * (STOPS.length - 1)
  const i = Math.min(Math.floor(x), STOPS.length - 2)
  const f = x - i
  return STOPS[i].map((c, k) => Math.round(c + (STOPS[i + 1][k] - c) * f))
}

// Points on the surface of a (2,3) torus knot tube, computed once.
function buildKnot(segments, rings) {
  const pts = []
  const curve = (t) => {
    const r = 2 + Math.cos(3 * t)
    return [r * Math.cos(2 * t), r * Math.sin(2 * t), Math.sin(3 * t)]
  }
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const p = curve(t)
    const q = curve(t + 0.01)
    // Tangent and a stable normal frame for the tube.
    const T = q.map((v, k) => v - p[k])
    const tl = Math.hypot(...T)
    const tn = T.map((v) => v / tl)
    let n = [tn[1], -tn[0], 0]
    const nl = Math.hypot(...n) || 1
    n = n.map((v) => v / nl)
    const b = [tn[1] * n[2] - tn[2] * n[1], tn[2] * n[0] - tn[0] * n[2], tn[0] * n[1] - tn[1] * n[0]]
    const color = mix(i / segments)
    for (let j = 0; j < rings; j++) {
      const a = (j / rings) * Math.PI * 2
      const r = 0.42
      pts.push({
        x: (p[0] + r * (Math.cos(a) * n[0] + Math.sin(a) * b[0])) / 3.4,
        y: (p[1] + r * (Math.cos(a) * n[1] + Math.sin(a) * b[1])) / 3.4,
        z: (p[2] + r * (Math.cos(a) * n[2] + Math.sin(a) * b[2])) / 3.4,
        c: color,
      })
    }
  }
  return pts
}

// A slowly turning 3D knot behind the page. It drifts side to side with scroll progress and
// leans toward the pointer. One still frame with reduced motion; paused in hidden tabs.
export default function Orb() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768
    const pts = buildKnot(small ? 120 : 220, small ? 6 : 9)
    const state = { rot: 0.6, progress: 0, tiltX: 0, tiltY: 0, mx: 0, my: 0 }
    let w = 0
    let h = 0
    let frame = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const draw = () => {
      const dark = document.documentElement.classList.contains('dark')
      const max = document.documentElement.scrollHeight - h
      const target = max > 0 ? window.scrollY / max : 0
      state.progress += (target - state.progress) * 0.06
      state.tiltX += (state.my * 0.35 - state.tiltX) * 0.05
      state.tiltY += (state.mx * 0.35 - state.tiltY) * 0.05
      if (!still) state.rot += 0.0035

      // Starts on the right in the hero, swings left and back as the story scrolls on.
      const cx = w * (small ? 0.5 : 0.5 + 0.26 * Math.cos(state.progress * Math.PI * 3))
      const cy = h * (small ? 0.42 : 0.52)
      const R = Math.min(w, h) * (small ? 0.42 : 0.36)
      const ay = state.rot + state.progress * Math.PI * 2 + state.tiltY
      const ax = 0.5 + Math.sin(state.rot * 0.7) * 0.25 + state.tiltX
      const [sy, cyr, sx, cxr] = [Math.sin(ay), Math.cos(ay), Math.sin(ax), Math.cos(ax)]
      const k = dark ? 1 : 0.55

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      for (const p of pts) {
        const x1 = p.x * cyr + p.z * sy
        const z1 = -p.x * sy + p.z * cyr
        const y2 = p.y * cxr - z1 * sx
        const z2 = p.y * sx + z1 * cxr
        const depth = (z2 + 1) / 2 // 0 far .. 1 near
        const persp = 1 / (1.9 - z2 * 0.6)
        ctx.fillStyle = `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, ${(0.12 + depth * 0.55) * k})`
        ctx.beginPath()
        ctx.arc(cx + x1 * R * persp * 1.6, cy + y2 * R * persp * 1.6, 0.5 + depth * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = () => {
      draw()
      frame = requestAnimationFrame(loop)
    }
    const onMove = (e) => {
      state.mx = e.clientX / w - 0.5
      state.my = e.clientY / h - 0.5
    }
    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden && !still) loop()
    }
    const onResize = () => {
      resize()
      if (still) draw()
    }

    window.addEventListener('resize', onResize)
    if (still) {
      draw()
    } else {
      window.addEventListener('pointermove', onMove)
      document.addEventListener('visibilitychange', onVisibility)
      loop()
    }
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />
}

import { useEffect, useRef } from 'react'

// Aurora stops: blue -> violet -> cyan -> blue.
const STOPS = [
  [59, 130, 246],
  [139, 92, 246],
  [34, 211, 238],
  [59, 130, 246],
]

function aurora(t) {
  const x = (((t % 1) + 1) % 1) * (STOPS.length - 1)
  const i = Math.min(Math.floor(x), STOPS.length - 2)
  const f = x - i
  return STOPS[i].map((c, k) => Math.round(c + (STOPS[i + 1][k] - c) * f))
}

// Five shapes with the same point count, all roughly unit-sized. Consecutive points sit next to
// each other in every shape, so linking i -> i+1 draws clean filaments.
const SHAPES = [
  // Spiral (Fibonacci) sphere.
  (i, n) => {
    const y = 1 - (2 * i) / (n - 1)
    const r = Math.sqrt(1 - y * y)
    const a = i * 2.399963
    return [Math.cos(a) * r, y, Math.sin(a) * r]
  },
  // (2,3) torus knot.
  (i, n) => {
    const t = (i / n) * Math.PI * 2 * 3
    const turn = (i % 3) * 0.12
    const r = 2 + Math.cos(3 * t) + turn
    return [(r * Math.cos(2 * t)) / 3.2, (r * Math.sin(2 * t)) / 3.2, Math.sin(3 * t) / 3.2]
  },
  // DNA double helix: two strands plus rungs.
  (i, n) => {
    const strand = i % 3
    const k = Math.floor(i / 3) / (n / 3)
    const a = k * Math.PI * 6
    const y = (k - 0.5) * 2.2
    if (strand === 2) {
      const f = ((i * 7) % 11) / 10 - 0.5
      return [Math.cos(a) * 0.55 * f * 2, y, Math.sin(a) * 0.55 * f * 2]
    }
    const off = strand ? Math.PI : 0
    return [Math.cos(a + off) * 0.55, y, Math.sin(a + off) * 0.55]
  },
  // Ring (torus).
  (i, n) => {
    const u = (i / n) * Math.PI * 2 * 24
    const v = (i / n) * Math.PI * 2
    return [(1 + 0.28 * Math.cos(u)) * Math.cos(v), 0.28 * Math.sin(u), (1 + 0.28 * Math.cos(u)) * Math.sin(v)]
  },
  // Wave field (animated in the loop).
  (i, n) => {
    const side = Math.ceil(Math.sqrt(n))
    const gx = (i % side) / (side - 1) - 0.5
    const gz = Math.floor(i / side) / (side - 1) - 0.5
    return [gx * 2.4, 0, gz * 2.4]
  },
]

const smooth = (x) => x * x * (3 - 2 * x)

// 256-step colour lookup ("rgba(r, g, b, ") so the draw loop doesn't allocate per point.
const LUT = Array.from({ length: 256 }, (_, i) => `rgba(${aurora(i / 256).join(', ')}, `)
const colorAt = (t) => LUT[Math.floor((((t % 1) + 1) % 1) * 255)]

// A living particle form behind the page. It turns, breathes and shimmers constantly, and morphs
// from sphere -> knot -> DNA helix -> ring -> wave as the page scrolls. It leans toward the
// pointer and spins faster while scrolling. One still frame with reduced motion; pauses when hidden.
export default function Orb() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768
    const n = small ? 900 : 1800
    const targets = SHAPES.map((shape) => Array.from({ length: n }, (_, i) => shape(i, n)))
    const phase = Array.from({ length: n }, (_, i) => (i * 12.9898) % (Math.PI * 2))
    const proj = new Float32Array(n * 3)
    const s = { t: 0, rot: 0.4, spin: 0, progress: 0, lastY: window.scrollY, tiltX: 0, tiltY: 0, mx: 0, my: 0 }
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
      s.progress += (target - s.progress) * 0.05
      // Scrolling adds a burst of spin that eases off.
      s.spin += (Math.min(Math.abs(window.scrollY - s.lastY), 80) * 0.0006 - s.spin) * 0.08
      s.lastY = window.scrollY
      s.tiltX += (s.my * 0.5 - s.tiltX) * 0.05
      s.tiltY += (s.mx * 0.6 - s.tiltY) * 0.05
      if (!still) {
        s.t += 0.016
        s.rot += 0.006 + s.spin
      }

      // Which two shapes to blend, and how far.
      const pos = s.progress * (SHAPES.length - 1)
      const a = Math.min(Math.floor(pos), SHAPES.length - 2)
      const f = smooth(Math.min(Math.max(pos - a, 0), 1))
      const A = targets[a]
      const B = targets[a + 1]

      const cx = w * (small ? 0.5 : 0.5 + 0.24 * Math.cos(s.progress * Math.PI * 3))
      const cy = h * (small ? 0.4 : 0.5)
      const R = Math.min(w, h) * (small ? 0.34 : 0.3) * (1 + Math.sin(s.t * 0.8) * 0.04)
      const ay = s.rot + s.tiltY
      // Tip the wave field toward the viewer so it isn't seen edge-on.
      const waveTilt = a + 1 === SHAPES.length - 1 ? f * 0.55 : 0
      const ax = 0.35 + waveTilt + Math.sin(s.t * 0.3) * 0.25 + s.tiltX
      const [sy, cyr, sx, cxr] = [Math.sin(ay), Math.cos(ay), Math.sin(ax), Math.cos(ax)]
      const k = dark ? 1 : 0.6
      const hueShift = s.t * 0.03

      // Project every point once.
      for (let i = 0; i < n; i++) {
        const p = A[i]
        const q = B[i]
        let x = p[0] + (q[0] - p[0]) * f
        let y = p[1] + (q[1] - p[1]) * f
        let z = p[2] + (q[2] - p[2]) * f
        // Wave field ripples; every shape breathes a little.
        if (a + 1 === SHAPES.length - 1) y += Math.sin(q[0] * 4 + s.t * 1.6) * Math.cos(q[2] * 4 + s.t * 1.2) * 0.22 * f
        const wob = 1 + Math.sin(s.t * 1.7 + phase[i]) * 0.035
        x *= wob
        y *= wob
        z *= wob
        const x1 = x * cyr + z * sy
        const z1 = -x * sy + z * cyr
        const y2 = y * cxr - z1 * sx
        const z2 = y * sx + z1 * cxr
        const persp = 1.6 / (2.2 - z2)
        proj[i * 3] = cx + x1 * R * persp
        proj[i * 3 + 1] = cy + y2 * R * persp
        proj[i * 3 + 2] = (z2 + 1.2) / 2.4 // depth 0 far .. 1 near
      }

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'

      // Filaments between neighbours.
      ctx.lineWidth = 0.6
      const linkMax = R * 0.16
      for (let i = 1; i < n; i++) {
        const x0 = proj[(i - 1) * 3]
        const y0 = proj[(i - 1) * 3 + 1]
        const x1 = proj[i * 3]
        const y1 = proj[i * 3 + 1]
        const d = Math.hypot(x1 - x0, y1 - y0)
        if (d > linkMax) continue
        const depth = proj[i * 3 + 2]
        ctx.strokeStyle = `${colorAt(i / n + hueShift)}${(0.05 + depth * 0.22) * (1 - d / linkMax) * k})`
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }

      // Points, with a soft shimmer.
      for (let i = 0; i < n; i++) {
        const depth = proj[i * 3 + 2]
        const twinkle = 0.75 + Math.sin(s.t * 3 + phase[i] * 3) * 0.25
        ctx.fillStyle = `${colorAt(i / n + hueShift)}${(0.12 + depth * 0.6) * twinkle * k})`
        ctx.beginPath()
        ctx.arc(proj[i * 3], proj[i * 3 + 1], 0.4 + depth * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = () => {
      draw()
      frame = requestAnimationFrame(loop)
    }
    const onMove = (e) => {
      s.mx = e.clientX / w - 0.5
      s.my = e.clientY / h - 0.5
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

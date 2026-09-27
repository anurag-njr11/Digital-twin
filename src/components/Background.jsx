import { useEffect, useRef } from 'react'

const COLORS = ['34, 211, 238', '59, 130, 246', '139, 92, 246'] // cyan, blue, purple

// Fixed particle constellation behind the page. Particles drift, link up when close, and reach
// toward the pointer. With reduced motion it draws one still frame; it pauses in hidden tabs.
export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768
    const count = small ? 35 : 90
    const linkDist = small ? 90 : 130
    const mouseDist = 180
    const mouse = { x: -1e4, y: -1e4 }
    let frame = 0
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.8,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.25 + 0.2,
    }))

    const draw = () => {
      // Lighter touch on the light theme so text stays easy to read.
      const k = document.documentElement.classList.contains('dark') ? 1 : 0.6
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        if (!still) {
          p.x = (p.x + p.vx + w) % w
          p.y = (p.y + p.vy + h) % h
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c}, ${p.a * k})`
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(${p.c}, ${(1 - d / linkDist) * 0.14 * k})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (dm < mouseDist) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dm / mouseDist) * 0.35 * k})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
    }

    const loop = () => {
      draw()
      frame = requestAnimationFrame(loop)
    }
    const onMove = (e) => Object.assign(mouse, { x: e.clientX, y: e.clientY })
    const onLeave = () => Object.assign(mouse, { x: -1e4, y: -1e4 })
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
      document.addEventListener('pointerleave', onLeave)
      document.addEventListener('visibilitychange', onVisibility)
      loop()
    }
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-50 dark:bg-ink">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[50px_50px] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)]" />
      <div className="absolute -top-1/4 -left-1/4 size-[70%] rounded-full bg-blue-400/10 blur-[150px] dark:bg-blue-900/20" />
      <div className="absolute -right-1/4 -bottom-1/4 size-[80%] rounded-full bg-purple-400/10 blur-[180px] dark:bg-purple-900/15" />
      <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,transparent_20%,#000000a0_100%)] dark:block" />
    </div>
  )
}

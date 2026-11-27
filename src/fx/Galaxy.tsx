import { useEffect, useRef } from 'react'

/**
 * Fixed "green galaxy" backdrop: twinkling starfield with scroll parallax,
 * occasional shooting stars, and slow-drifting aurora nebula clouds.
 */
const STAR_COLORS = ['255,255,255', '168,232,244', '111,214,234', '76,155,196', '214,247,255']

type Star = { x: number; y: number; r: number; depth: number; phase: number; speed: number; c: string }
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number }

export default function Galaxy() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, dpr = 1, raf = 0
    let stars: Star[] = []
    const meteors: Meteor[] = []
    let nextMeteor = performance.now() + 2500

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(420, Math.round((w * h) / 4200))
      stars = Array.from({ length: count }, () => {
        const depth = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.3 + depth * 1.25,
          depth,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          c: Math.random() < 0.55 ? STAR_COLORS[0] : STAR_COLORS[1 + Math.floor(Math.random() * 4)],
        }
      })
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const scroll = window.scrollY
      for (const s of stars) {
        const y = (((s.y - scroll * (0.04 + s.depth * 0.12)) % h) + h) % h
        const a = reduced ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase))
        ctx.beginPath()
        ctx.fillStyle = `rgba(${s.c},${a * (0.45 + s.depth * 0.55)})`
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
        if (s.r > 1.2 && a > 0.85) {
          // little cross-flare on the brightest stars
          ctx.strokeStyle = `rgba(${s.c},${(a - 0.85) * 2})`
          ctx.lineWidth = 0.6
          ctx.beginPath(); ctx.moveTo(s.x - 5, y); ctx.lineTo(s.x + 5, y); ctx.moveTo(s.x, y - 5); ctx.lineTo(s.x, y + 5); ctx.stroke()
        }
      }

      if (!reduced) {
        if (t > nextMeteor) {
          const fromLeft = Math.random() < 0.5
          meteors.push({
            x: fromLeft ? Math.random() * w * 0.4 : w * 0.6 + Math.random() * w * 0.4,
            y: Math.random() * h * 0.4,
            vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5),
            vy: 3 + Math.random() * 2.5,
            life: 0,
            max: 55 + Math.random() * 30,
          })
          nextMeteor = t + 3500 + Math.random() * 6000
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i]
          m.x += m.vx; m.y += m.vy; m.life++
          const fade = 1 - m.life / m.max
          const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14)
          g.addColorStop(0, `rgba(230,250,255,${fade})`)
          g.addColorStop(0.3, `rgba(111,214,234,${fade * 0.6})`)
          g.addColorStop(1, 'rgba(76,155,196,0)')
          ctx.strokeStyle = g
          ctx.lineWidth = 1.6
          ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14); ctx.stroke()
          if (m.life >= m.max) meteors.splice(i, 1)
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    const onResize = () => { resize(); if (reduced) draw(0) }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)
    const onScroll = () => { if (reduced) draw(0) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* aurora nebula clouds */}
      <div className="nebula absolute -left-[15vw] top-[5vh] h-[55vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(111,214,234,.16),transparent)] blur-3xl [animation:drift-a_26s_ease-in-out_infinite]" />
      <div className="nebula absolute -right-[10vw] top-[35vh] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(closest-side,rgba(76,155,196,.13),transparent)] blur-3xl [animation:drift-b_32s_ease-in-out_infinite]" />
      <div className="nebula absolute bottom-[-10vh] left-[20vw] h-[45vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(214,247,255,.07),transparent)] blur-3xl [animation:drift-a_38s_ease-in-out_infinite_reverse]" />
      <div className="nebula absolute left-[35vw] top-[-15vh] h-[40vh] w-[40vw] rounded-full bg-[radial-gradient(closest-side,rgba(60,196,220,.14),transparent)] blur-3xl [animation:drift-b_30s_ease-in-out_infinite]" />
      {/* smoky base: petrol-to-steel atmosphere like a misty ocean at night */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(30,90,112,.35),transparent_60%),radial-gradient(90%_60%_at_50%_110%,rgba(110,152,168,.22),transparent_70%)]" />
      <canvas ref={ref} className="absolute inset-0 opacity-70" />
      {/* drifting fog banks */}
      <div className="mist absolute -left-[20vw] top-[18vh] h-[38vh] w-[90vw] rounded-[50%] bg-[radial-gradient(closest-side,rgba(168,210,224,.10),transparent)] blur-2xl [animation:fog-a_48s_ease-in-out_infinite]" />
      <div className="mist absolute -right-[25vw] top-[52vh] h-[42vh] w-[95vw] rounded-[50%] bg-[radial-gradient(closest-side,rgba(140,190,208,.09),transparent)] blur-2xl [animation:fog-b_60s_ease-in-out_infinite]" />
      {/* misty floor glow */}
      <div className="absolute inset-x-0 bottom-0 h-[35vh] bg-gradient-to-t from-[rgba(120,170,188,.10)] to-transparent" />
      {/* soft vignette so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,18,26,.75))]" />
    </div>
  )
}

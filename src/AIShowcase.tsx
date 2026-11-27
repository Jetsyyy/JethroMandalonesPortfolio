import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, MousePointerClick } from 'lucide-react'

const RobotScene = lazy(() => import('./ai/RobotScene'))

const TYPED = ['VOICE AGENTS & CALL FLOWS', 'AI TUTORING & SPEECH FEEDBACK', 'CHAT, SUMMARIES & ANALYTICS', 'OPENAI · AZURE AI · RETELL']
const SWAP = ['talks.', 'tutors.', 'analyzes.', 'sells.']
const STACK = [
  { name: 'OpenAI API', use: 'Chat · reasoning', level: 92 },
  { name: 'Azure AI Speech', use: 'Pronunciation · STT', level: 85 },
  { name: 'Retell AI', use: 'Voice agents', level: 80 },
]
const SHIPPED = ['TalkReady · IEEE APWiMob 2025', 'Succor Haven · AI tutor', "Gallagher's · voice agents"]

function useTypewriter(lines: string[], active: boolean) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!active) return
    let li = 0, ci = 0, deleting = false
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      const line = lines[li]
      if (!deleting) {
        ci++
        setText(line.slice(0, ci))
        if (ci === line.length) { deleting = true; t = setTimeout(tick, 1600); return }
      } else {
        ci--
        setText(line.slice(0, ci))
        if (ci === 0) { deleting = false; li = (li + 1) % lines.length }
      }
      t = setTimeout(tick, deleting ? 28 : 55)
    }
    t = setTimeout(tick, 400)
    return () => clearTimeout(t)
  }, [lines, active])
  return text
}

function Corner({ className }: { className: string }) {
  return <span aria-hidden className={`absolute h-5 w-5 border-lime/70 ${className}`} />
}

export default function AIShowcase() {
  const wrap = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)   // start loading the 3D chunk
  const [visible, setVisible] = useState(false)
  const [swap, setSwap] = useState(0)
  const poke = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const typed = useTypewriter(TYPED, visible && !reduced)

  useEffect(() => {
    const el = wrap.current!
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '600px' })
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    nearIO.observe(el); visIO.observe(el)
    return () => { nearIO.disconnect(); visIO.disconnect() }
  }, [])

  useEffect(() => {
    if (!visible || reduced) return
    const t = setInterval(() => setSwap((s) => (s + 1) % SWAP.length), 2400)
    return () => clearInterval(t)
  }, [visible, reduced])

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -(((e.clientY - r.top) / r.height) * 2 - 1) }
  }

  return (
    <section id="ai" ref={wrap} className="relative mx-auto max-w-[1400px] px-3 py-16 sm:px-6 md:py-24">
      <div onPointerMove={onMove} onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}
        className="relative h-[100svh] max-h-[860px] min-h-[640px] overflow-hidden rounded-[28px] border border-mint/10 bg-[#020B10]/80 shadow-[0_40px_120px_-40px_rgba(111,214,234,.35)]">
        {/* HUD grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(168,232,244,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,232,244,.05)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(111,214,234,.22),transparent)] blur-2xl" />

        {/* robot */}
        <div className="absolute inset-x-0 bottom-[22%] top-[12%] cursor-pointer md:inset-0 md:bottom-0 md:top-0"
          onClick={() => (poke.current += 1)} role="button" aria-label="Spin the robot" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (poke.current += 1)}>
          {near && (
            <Suspense fallback={null}>
              <RobotScene active={visible} reduced={reduced} poke={poke} pointer={pointer} />
            </Suspense>
          )}
        </div>

        {/* frame corners + system labels */}
        <Corner className="left-4 top-4 border-l border-t" />
        <Corner className="right-4 top-4 border-r border-t" />
        <Corner className="bottom-4 left-4 border-b border-l" />
        <Corner className="bottom-4 right-4 border-b border-r" />
        <div className="pointer-events-none absolute left-8 top-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-mint/60">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" /> SYS://JM-AI.v2 · online
        </div>
        <div className="pointer-events-none absolute right-8 top-7 hidden font-mono text-[10px] uppercase tracking-[.2em] text-mint/50 sm:block">
          14.07°N · 121.32°E · San Pablo, PH
        </div>

        {/* typing command bar */}
        <div className="absolute left-1/2 top-16 w-[min(560px,88%)] -translate-x-1/2">
          <div className="relative flex items-center gap-3 border border-mint/20 bg-space/70 px-3 py-2.5 backdrop-blur">
            <span className="grid h-6 w-6 shrink-0 place-items-center border border-lime/50 font-mono text-[10px] text-lime">AI</span>
            <span className="truncate font-mono text-[11px] tracking-[.18em] text-ink sm:text-xs">
              {reduced ? TYPED[0] : typed}<span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-lime" />
            </span>
            <span aria-hidden className="absolute -left-px -top-px h-2 w-2 border-l border-t border-lime" />
            <span aria-hidden className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-lime" />
          </div>
        </div>

        {/* boxed headline, bottom-left */}
        <div className="pointer-events-none absolute bottom-8 left-5 right-5 sm:bottom-10 sm:left-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[.25em] text-emerald sm:text-[11px]">Unlock the power of · AI integration</p>
          <h2 className="font-display text-[13vw] font-medium leading-[.95] tracking-tight text-white sm:text-7xl">
            <span className="inline-block border border-mint/40 px-3 pb-1 sm:px-4">AI that</span>
            <br />
            <span className="mt-2 inline-grid overflow-hidden border border-lime/60 px-3 pb-1 align-top leading-[1.05] sm:px-4">
              <span key={swap} className="word-rise !block"><span className="accent-solid">{SWAP[swap]}</span></span>
            </span>
          </h2>
        </div>

        {/* AI stack, right */}
        <div className="absolute right-8 top-1/2 hidden w-60 -translate-y-1/2 space-y-5 lg:block">
          <p className="font-mono text-[10px] uppercase tracking-[.25em] text-mint/60">// stack</p>
          {STACK.map((s, i) => (
            <div key={s.name}>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-sm text-white">{s.name}</span>
                <span className="font-mono text-[10px] text-muted">{s.use}</span>
              </div>
              <div className="mt-1.5 h-px bg-mint/15">
                <div className="h-px bg-gradient-to-r from-lime via-emerald to-cyan transition-[width] duration-[1.6s] ease-out"
                  style={{ width: visible ? `${s.level}%` : '0%', transitionDelay: `${300 + i * 200}ms` }} />
              </div>
            </div>
          ))}
          <p className="pt-3 font-mono text-[10px] uppercase tracking-[.25em] text-mint/60">// shipped in</p>
          <ul className="space-y-1.5">
            {SHIPPED.map((s) => <li key={s} className="flex items-center gap-2 text-xs text-muted"><span className="h-1 w-1 bg-lime" />{s}</li>)}
          </ul>
        </div>

        {/* bottom-right hint */}
        <div className="pointer-events-none absolute bottom-10 right-10 hidden items-end gap-4 md:flex">
          <p className="max-w-[15rem] text-right text-xs leading-relaxed text-muted">
            Practical AI inside real products: voice, tutoring and analytics. <span className="inline-flex items-center gap-1 text-mint"><MousePointerClick size={12} /> Click the bot.</span>
          </p>
          <a href="#about" className="pointer-events-auto grid h-10 w-10 place-items-center border border-mint/25 text-mint hover:border-lime hover:text-lime" aria-label="Continue to About">
            <ArrowDown size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

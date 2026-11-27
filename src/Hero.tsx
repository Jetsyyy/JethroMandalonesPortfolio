import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { pitch, profile } from './data'

const DeskScene = lazy(() => import('./hero3d/DeskScene'))

function supportsWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const CREDS = ['IS Club Vice President', "Top 6 Dean's Lister", '486 OJT hours', 'Laravel · React · AI']
const fade = (v: number) => Math.min(1, Math.max(0, v))

function Pitch() {
  return (
    <>
      <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl">
        {pitch.headline}
        <span className="mt-1 block text-aqua">{pitch.headlineAccent}</span>
      </h1>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">{pitch.sub}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-aqua px-6 py-3 font-medium text-deep transition hover:bg-mint">
          Start a project <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </a>
        <a href="#demos" className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-deep/60 px-6 py-3 font-medium text-ink backdrop-blur transition hover:border-aqua/60">
          Watch demos
        </a>
      </div>
      <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-muted">
        {CREDS.map((t) => <li key={t} className="flex items-center gap-1.5"><Check size={13} className="text-aqua" />{t}</li>)}
      </ul>
    </>
  )
}

export default function Hero() {
  const wrap = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [p, setP] = useState(0)
  const [active, setActive] = useState(true)
  const [gl] = useState(supportsWebGL)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = Math.max(1, el.offsetHeight - window.innerHeight)
      const v = fade(-r.top / total)
      progress.current = v
      setP(v)
      setActive(r.bottom > 0)
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  const scene = useMemo(
    () => (
      <Suspense fallback={null}>
        <DeskScene progress={progress} reduced={reduced} active={active} />
      </Suspense>
    ),
    [reduced, active],
  )

  // No WebGL: plain, fast hero with the same pitch
  if (!gl) {
    return (
      <section id="top" className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pt-24 sm:px-6">
          <Pitch />
        </div>
      </section>
    )
  }

  const intro = 1 - fade(p * 3.2) // wordmark + glass card fade out early
  const outro = fade((p - 0.5) * 3) // pitch fades in once the laptop is open

  return (
    <section id="top" ref={wrap} className={reduced ? 'relative h-[100svh]' : 'relative h-[260vh]'}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0">{scene}</div>

        {/* legibility vignettes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-deep to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-deep/85 via-deep/30 to-transparent transition-opacity duration-300" style={{ opacity: reduced ? 1 : outro }} />

        {/* ── Act 1: flat-lay with a giant wordmark ── */}
        {!reduced && (
          <div className="pointer-events-none absolute inset-0" style={{ opacity: intro, transform: `translateY(${-p * 120}px)` }} aria-hidden={intro < 0.1}>
            <div className="absolute left-4 top-24 sm:left-8 sm:top-24">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[.3em] text-mint/80 sm:text-xs">Full-stack developer · AI integration</p>
              <p className="font-display text-[23vw] font-bold leading-[.8] tracking-[-.04em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,.45)] sm:text-[15vw]">
                JETHRO
              </p>
            </div>
            <div className="pointer-events-auto absolute bottom-24 left-4 right-4 max-w-xs rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl sm:bottom-10 sm:left-8 sm:right-auto">
              <p className="font-display text-lg font-semibold uppercase leading-tight">Designed, built<br />and shipped by<br />Jethro Mandalones.</p>
              <p className="mt-6 text-xs text-white/70">IS graduate in Business Analytics. Building web, mobile and AI systems from {profile.location.split(',')[0]}.</p>
            </div>
            <div className="absolute bottom-10 right-8 hidden max-w-[16rem] text-right text-sm leading-relaxed text-ink/90 md:block">
              Web apps, AI tools and analytics systems, made to solve real business problems.
            </div>
            <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[.3em] text-mint/80 sm:flex">
              Scroll to open
              <span className="relative h-9 w-5 rounded-full border border-mint/50">
                <span className="absolute left-1/2 top-1.5 h-2 w-0.5 -translate-x-1/2 animate-bounce rounded bg-aqua" />
              </span>
            </div>
          </div>
        )}

        {/* ── Act 2: the pitch, beside the open laptop ── */}
        <div
          className="absolute inset-x-0 bottom-0 px-4 pb-10 sm:inset-y-0 sm:flex sm:items-center sm:px-8 sm:pb-0"
          style={{ opacity: reduced ? 1 : outro, transform: `translateY(${(1 - (reduced ? 1 : outro)) * 40}px)`, pointerEvents: (reduced || outro > 0.5) ? 'auto' : 'none' }}
          aria-hidden={!reduced && outro < 0.1}
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-xl">
              <p className="mb-4 font-mono text-xs uppercase tracking-[.3em] text-aqua">{profile.name}</p>
              <Pitch />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

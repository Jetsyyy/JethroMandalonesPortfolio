import { createPortal } from 'react-dom'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, Play, X } from 'lucide-react'
import { creativeWorks, type CreativeWork } from './data'

const thumb = (id: string, w = 1000) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const FILTERS = ['All', 'Campus', 'Client', 'Video'] as const
type Filter = (typeof FILTERS)[number]

/* ───────── 1. Cinematic statement: lines rise, real work pops between the words ───────── */

function Pill({ id, delay, video }: { id: string; delay: number; video?: boolean }) {
  return (
    <span className="pill-pop relative mx-[.12em] inline-block h-[.78em] w-[1.55em] overflow-hidden rounded-full align-[-.06em] ring-1 ring-emerald/40"
      style={{ transitionDelay: `${delay}ms` }} aria-hidden>
      <img src={thumb(id, 400)} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
      {video && <span className="absolute inset-0 grid place-items-center bg-black/30"><Play size={14} className="fill-white text-white" /></span>}
    </span>
  )
}

function Line({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="block overflow-hidden pb-[.08em]">
      <span className="line-rise block" style={{ transitionDelay: `${i * 140}ms` }}>{children}</span>
    </span>
  )
}

export function CreativeIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.35 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const counts = useMemo(() => ({
    campus: creativeWorks.filter((w) => w.group === 'Campus').length,
    client: creativeWorks.filter((w) => w.group === 'Client').length,
    video: creativeWorks.filter((w) => w.group === 'Video').length,
  }), [])

  return (
    <section id="creative" className="relative mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 md:pt-32">
      <p className="eyebrow mb-8 flex items-center gap-3"><span className="h-px w-8 bg-gradient-to-r from-lime to-emerald" />Graphics & video editing</p>
      <div ref={ref} className={shown ? 'reveal-lines in' : 'reveal-lines'}>
        <h2 className="font-serif text-[11vw] leading-[.98] tracking-[-.02em] text-white sm:text-7xl md:text-8xl">
          <Line i={0}>I don't just build systems.</Line>
          <Line i={1}>I <span className="accent">design</span> <Pill id="1ZxUDGWX_kndeEAte62gcFa_jt-eU1MQT" delay={500} /> the visuals</Line>
          <Line i={2}>that make <Pill id="11obvisFpNmpidVsEk8UqMJfDbrAybBxi" delay={700} /> people</Line>
          <Line i={3}><span className="accent">stop scrolling.</span> <Pill id="12ixbMswqs06qwjvPzecRYaHm1vK0RMiJ" delay={900} video /></Line>
        </h2>
        <div className="line-fade mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ transitionDelay: '900ms' }}>
          <p className="max-w-md text-lg leading-relaxed text-muted">
            Pubmats for campus events, a full social series for a luxury dry-cleaning brand, and video edits, made in Canva and CapCut.
          </p>
          <ul className="flex flex-wrap gap-2">
            {['Canva', 'CapCut', 'Figma'].map((t) => <li key={t} className="aurora-ring rounded-full bg-space/80 px-4 py-2 font-mono text-xs text-lime">{t}</li>)}
          </ul>
          <dl className="flex gap-8 font-mono text-xs text-muted">
            <div><dt className="sr-only">Campus</dt><dd><span className="font-display text-3xl font-bold text-white">{counts.campus}</span> campus</dd></div>
            <div><dt className="sr-only">Client</dt><dd><span className="font-display text-3xl font-bold text-white">{counts.client}</span> client</dd></div>
            <div><dt className="sr-only">Video</dt><dd><span className="font-display text-3xl font-bold text-white">{counts.video}</span> video</dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ───────── 2. Case study: the clicked card flies out of the ring into a full panel ───────── */

type Meta = { client: string; format: string; tagline: string; brief: string; services: string[] }

function metaFor(w: CreativeWork): Meta {
  if (w.group === 'Video') {
    return {
      client: 'Personal project', format: '16:9 video edit',
      tagline: 'Fresh cut, bold titles.',
      brief: 'A short promotional edit with punchy kinetic titles, colour grading and pacing cut to the beat.',
      services: ['Editing', 'Motion titles', 'Colour'],
    }
  }
  if (w.title.startsWith('Sudsies')) {
    return {
      client: 'Sudsies · luxury dry cleaning', format: '4:5 social post',
      tagline: 'Luxury care, told post by post.',
      brief: 'Part of a 14-post social series for a premium garment-care brand: consistent layouts, brand colours and copy that sells care, not just cleaning.',
      services: ['Social series', 'Layout', 'Brand system'],
    }
  }
  if (w.group === 'Client') {
    return {
      client: 'Local food retailer', format: '16:9 promo',
      tagline: 'Loud, bright, order-now energy.',
      brief: 'A high-energy product promo built to grab attention in feeds and push a clear call to action.',
      services: ['Promo design', 'Product layout', 'CTA'],
    }
  }
  return {
    client: 'PLSP campus organizations', format: '16:9 event pubmat',
    tagline: 'Campus events that look the part.',
    brief: 'Event publication material for college organizations: bold typography, photo compositing and a layout that reads at a glance.',
    services: ['Pubmat', 'Typography', 'Photo compositing'],
  }
}

function CaseStudy({ list, index, origin, onClose, onStep }: {
  list: CreativeWork[]; index: number; origin: DOMRect | null; onClose: () => void; onStep: (d: number) => void
}) {
  const w = list[index]
  const m = metaFor(w)
  const art = useRef<HTMLDivElement>(null)
  const [flown, setFlown] = useState(!origin)

  // FLIP: start the artwork exactly where the card was in the ring, then let it fly into place
  useLayoutEffect(() => {
    const el = art.current
    if (!el || !origin) { setFlown(true); return }
    const to = el.getBoundingClientRect()
    const sx = origin.width / to.width, sy = origin.height / to.height
    el.style.transition = 'none'
    el.style.transformOrigin = '0 0'
    el.style.transform = `translate(${origin.left - to.left}px, ${origin.top - to.top}px) scale(${sx}, ${sy})`
    el.style.borderRadius = '18px'
    void el.offsetWidth
    requestAnimationFrame(() => {
      el.style.transition = 'transform .85s cubic-bezier(.7,0,.2,1), border-radius .85s'
      el.style.transform = 'none'
      el.style.borderRadius = '28px'
      setTimeout(() => setFlown(true), 380)
    })
    // only on first open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose, onStep])

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${w.title} case study`} className="fixed inset-0 z-[100] overflow-y-auto bg-space/95 backdrop-blur-md">
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(111,214,234,.16),transparent)] blur-2xl" />
      <div className="relative mx-auto grid min-h-full max-w-7xl items-center gap-8 px-4 py-20 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <button onClick={onClose} aria-label="Close case study" className="fixed right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-mint/25 bg-space/80 text-mint transition hover:rotate-90 hover:border-lime hover:text-lime sm:right-8 sm:top-8">
          <X size={20} />
        </button>

        <div ref={art} className={`relative overflow-hidden rounded-[28px] bg-dark shadow-[0_40px_120px_-30px_rgba(111,214,234,.45)] ring-1 ring-emerald/30 ${w.ratio === 'post' ? 'mx-auto aspect-[4/5] w-full max-w-[520px]' : 'aspect-video w-full'}`}>
          {w.group === 'Video' && flown ? (
            <iframe src={`https://drive.google.com/file/d/${w.driveId}/preview`} title={w.title} allow="autoplay; fullscreen" allowFullScreen className="h-full w-full" />
          ) : (
            <>
              {/* instant: same size the ring already loaded; sharp version fades in over it */}
              <img key={`s${w.driveId}`} src={thumb(w.driveId, 700)} alt={w.title} className="absolute inset-0 h-full w-full object-cover text-transparent" />
              <img key={`l${w.driveId}`} src={thumb(w.driveId, 1800)} alt="" aria-hidden
                onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
                className="absolute inset-0 h-full w-full object-cover text-transparent opacity-0 transition-opacity duration-500" />
            </>
          )}
        </div>

        <div className={`transition-all duration-700 ${flown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <p className="font-mono text-[11px] uppercase tracking-[.25em] text-emerald">
            {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')} · {w.group}
          </p>
          <h3 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl">{w.title.replace(/^Sudsies · /, 'Sudsies — ')}</h3>
          <p className="mt-3 font-serif text-2xl italic text-lime">{m.tagline}</p>
          <p className="mt-5 max-w-md leading-relaxed text-muted">{m.brief}</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-mint/10 pt-6">
            <div><dt className="font-mono text-[10px] uppercase tracking-widest text-muted">Client</dt><dd className="mt-1 text-white">{m.client}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-widest text-muted">Format</dt><dd className="mt-1 text-white">{m.format}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-widest text-muted">Made in</dt><dd className="mt-1 text-white">{w.tool}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-widest text-muted">Services</dt><dd className="mt-1 text-white">{m.services.join(' · ')}</dd></div>
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => onStep(-1)} aria-label="Previous work" className="grid h-12 w-12 place-items-center rounded-full border border-mint/25 text-mint hover:border-lime hover:text-lime"><ArrowLeft size={18} /></button>
            <button onClick={() => onStep(1)} aria-label="Next work" className="grid h-12 w-12 place-items-center rounded-full border border-mint/25 text-mint hover:border-lime hover:text-lime"><ArrowRight size={18} /></button>
            <a href={`https://drive.google.com/file/d/${w.driveId}/view`} target="_blank" rel="noreferrer"
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-space transition hover:bg-mint">
              Full size <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  , document.body)
}

/* ───────── 3. The orbit: works circle a light; scrolling spins the next one to the front ───────── */

const TILT_Y = 40 * (Math.PI / 180) // how far the ring is turned away (left side comes toward you)
const FRONT = Math.PI // angle that sits front-left, nearest the camera

export function CreativeReel() {
  const [filter, setFilter] = useState<Filter>('All')
  const list = useMemo(() => (filter === 'All' ? creativeWorks : creativeWorks.filter((w) => w.group === filter)), [filter])
  const n = list.length
  const wrap = useRef<HTMLElement>(null)
  const cardEls = useRef<(HTMLButtonElement | null)[]>([])
  const [prog, setProg] = useState(0)
  const [vw, setVw] = useState(() => window.innerWidth)
  const [open, setOpen] = useState<{ i: number; origin: DOMRect | null } | null>(null)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const [near, setNear] = useState(false) // load the artwork only when the section is close
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: '1200px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setProg(clamp(-r.top / Math.max(1, el.offsetHeight - window.innerHeight)))
      setVw(window.innerWidth)
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])

  // one full revolution across the pinned scroll, plus a slow idle drift
  const [drift, setDrift] = useState(0)
  useEffect(() => {
    if (reduced) return
    let raf = 0, last = performance.now()
    const tick = (t: number) => { setDrift((d) => d + (t - last) * 0.00004); last = t; raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const step = (2 * Math.PI) / n
  const spin = prog * (n - 1) * step + (open ? 0 : drift)
  const pos = spin / step
  const activeIdx = ((Math.round(pos) % n) + n) % n

  const narrow = vw < 768
  const R = narrow ? Math.min(vw * 0.4, 170) : Math.min(vw * 0.3, 420)
  const cardH = narrow ? 84 : 150

  const pickFilter = (f: Filter) => {
    setFilter(f)
    const el = wrap.current
    if (el && window.scrollY > el.offsetTop) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }

  const openAt = (i: number) => setOpen({ i, origin: cardEls.current[i]?.getBoundingClientRect() ?? null })
  const stepOpen = useCallback((d: number) => setOpen((o) => (o ? { i: (o.i + d + n) % n, origin: null } : o)), [n])

  const active = list[activeIdx]

  if (reduced) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="columns-2 gap-4 md:columns-3">
          {creativeWorks.map((w, i) => (
            <button key={w.driveId} onClick={() => setOpen({ i, origin: null })} className="mb-4 block w-full overflow-hidden rounded-2xl ring-1 ring-mint/10">
              <img src={thumb(w.driveId, 700)} alt={w.title} className="w-full" />
            </button>
          ))}
        </div>
        {open && <CaseStudy list={creativeWorks} index={open.i} origin={null} onClose={() => setOpen(null)} onStep={(d) => setOpen((o) => o && { i: (o.i + d + creativeWorks.length) % creativeWorks.length, origin: null })} />}
      </section>
    )
  }

  return (
    <section ref={wrap} className="relative" style={{ height: `${Math.max(320, n * 26)}vh` }} aria-label="Graphics and video portfolio">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_50%_50%,rgba(3,18,26,.2),#02090E_70%)]">
        {/* header */}
        <div className="relative z-30 mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-4 px-4 pt-24 sm:px-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.25em] text-emerald">Selected edits · orbit</p>
            <p className="mt-1 font-mono text-xs text-muted">Scroll to spin · click any piece to open</p>
          </div>
          <div role="tablist" aria-label="Filter edits" className="glass flex gap-1 !rounded-full p-1">
            {FILTERS.map((f) => {
              const count = f === 'All' ? creativeWorks.length : creativeWorks.filter((w) => w.group === f).length
              return (
                <button key={f} role="tab" aria-selected={filter === f} onClick={() => pickFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs transition sm:px-4 sm:text-sm ${filter === f ? 'bg-lime font-medium text-space' : 'text-muted hover:text-mint'}`}>
                  {f} <span className="font-mono opacity-60">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* the light */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(111,214,234,.22),rgba(76,155,196,.06)_55%,transparent)]" />
          <div className="orbit-rays absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 [background:repeating-conic-gradient(from_0deg,rgba(230,250,255,.22)_0deg_.6deg,transparent_.6deg_9deg)] [mask-image:radial-gradient(closest-side,#000_10%,transparent)]" />
          <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,.95),rgba(214,247,255,.35)_40%,transparent)] blur-md" />
          <div className="orbit-core absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_40px_14px_rgba(255,255,255,.85),0_0_120px_40px_rgba(111,214,234,.5)]" />
          <div className="absolute left-1/2 top-1/2 h-px w-[60vmin] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>

        {/* the ring */}
        <div className="absolute inset-0" style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}>
          <div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d' }}>
            {list.map((w, i) => {
              const th = FRONT + i * step - spin
              const cx = R * Math.cos(th), cy = R * Math.sin(th) * 0.78
              const x = cx * Math.cos(TILT_Y)
              const z = -cx * Math.sin(TILT_Y)            // left side (cos<0) comes toward the camera
              const depth = (z / (R * Math.sin(TILT_Y)) + 1) / 2 // 0 = far, 1 = near
              const isActive = i === activeIdx
              const wCard = w.ratio === 'wide' ? cardH * 1.6 : cardH * 0.8
              const hCard = w.ratio === 'wide' ? cardH * 0.9 : cardH
              return (
                <button
                  key={w.driveId}
                  ref={(el) => { cardEls.current[i] = el }}
                  onClick={() => openAt(i)}
                  aria-label={`Open ${w.title}`}
                  tabIndex={depth > 0.55 ? 0 : -1}
                  className="group absolute left-0 top-0 overflow-hidden rounded-[14px] bg-dark text-left outline-none"
                  style={{
                    width: wCard, height: hCard,
                    transform: `translate(-50%,-50%) translate3d(${x}px, ${cy}px, ${z}px) rotateY(${-cx * 0.035 - 8}deg) rotateZ(${Math.sin(th) * -6}deg)`,
                    filter: `brightness(${0.35 + depth * 0.75}) saturate(${0.6 + depth * 0.5})`,
                    boxShadow: isActive
                      ? '0 0 0 2px #D6F7FF, 0 30px 70px -20px rgba(214,247,255,.55)'
                      : `0 0 0 1.5px rgba(${w.group === 'Campus' ? '111,214,234' : w.group === 'Video' ? '214,247,255' : '76,155,196'},${0.25 + depth * 0.45})`,
                    zIndex: Math.round(depth * 100),
                  }}
                >
                  <img src={near ? thumb(w.driveId, 700) : undefined} alt="" draggable={false}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110" />
                  {/* curved-glass sheen */}
                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(255,255,255,.22),transparent_35%,transparent_65%,rgba(0,0,0,.35))]" />
                  {w.group === 'Video' && (
                    <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime text-space shadow-[0_0_24px] shadow-lime/70">
                      <Play size={16} className="translate-x-[1px] fill-current" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* big title of the piece at the front */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#02090E] via-[#02090E]/70 to-transparent px-4 pb-8 pt-20 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[.25em] text-emerald">
                <span className="text-lime">{String(activeIdx + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')} · {active.group} · {active.tool}
              </p>
              <div className="overflow-hidden">
                <h3 key={active.driveId} className="word-rise !block truncate font-display text-[11vw] font-bold leading-[.95] tracking-[-.03em] text-white sm:text-7xl md:text-8xl">
                  {active.title.replace(/^Sudsies · /, '').replace(/ · .*$/, '')}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted">{active.title.startsWith('Sudsies') ? 'Sudsies social series' : metaFor(active).format}</p>
            </div>
            <button onClick={() => openAt(activeIdx)} className="pointer-events-auto hidden shrink-0 items-center gap-2 rounded-full border border-lime/50 px-5 py-3 text-sm text-lime transition hover:bg-lime hover:text-space sm:inline-flex">
              Open case <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      {open && <CaseStudy key={open.origin ? `o${open.i}` : 'nav'} list={list} index={open.i} origin={open.origin} onClose={() => setOpen(null)} onStep={stepOpen} />}
    </section>
  )
}

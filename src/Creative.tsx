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

/* ───────── 2. Lightbox with prev / next ───────── */

function Viewer({ list, index, onClose, onStep }: { list: CreativeWork[]; index: number; onClose: () => void; onStep: (d: number) => void }) {
  const w = list[index]
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

  return (
    <div role="dialog" aria-modal="true" aria-label={w.title} onClick={onClose}
      className="panel-in fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-space/95 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-6xl items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-emerald">{w.group} · {w.tool}</p>
          <h3 className="font-serif text-3xl text-white">{w.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
          <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full border border-mint/20 text-mint hover:bg-dark"><X size={20} /></button>
        </div>
      </div>
      <div className="relative flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onStep(-1)} aria-label="Previous" className="absolute left-0 z-10 grid h-12 w-12 place-items-center rounded-full border border-mint/20 bg-space/80 text-mint hover:border-lime hover:text-lime sm:-left-2"><ArrowLeft size={20} /></button>
        {w.group === 'Video' ? (
          <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black ring-1 ring-emerald/30">
            <iframe src={`https://drive.google.com/file/d/${w.driveId}/preview`} title={w.title} allow="autoplay; fullscreen" allowFullScreen className="h-full w-full" />
          </div>
        ) : (
          <img key={w.driveId} src={thumb(w.driveId, 2000)} alt={w.title} className="panel-in max-h-full max-w-full rounded-xl object-contain shadow-[0_0_80px_-20px] shadow-emerald/40" />
        )}
        <button onClick={() => onStep(1)} aria-label="Next" className="absolute right-0 z-10 grid h-12 w-12 place-items-center rounded-full border border-mint/20 bg-space/80 text-mint hover:border-lime hover:text-lime sm:-right-2"><ArrowRight size={20} /></button>
      </div>
      <a href={`https://drive.google.com/file/d/${w.driveId}/view`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-mint">Open in Google Drive <ExternalLink size={14} /></a>
    </div>
  )
}

/* ───────── 3. Pinned horizontal reel on a curved 3D track ───────── */

export function CreativeReel() {
  const [filter, setFilter] = useState<Filter>('All')
  const list = useMemo(() => (filter === 'All' ? creativeWorks : creativeWorks.filter((w) => w.group === filter)), [filter])
  const wrap = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLButtonElement | null)[]>([])
  const [dims, setDims] = useState({ trackW: 0, vw: 1, vh: 1, centers: [] as number[] })
  const [prog, setProg] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0, on: false, label: 'View' })
  const [open, setOpen] = useState<number | null>(null)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  const measure = useCallback(() => {
    const t = track.current
    if (!t) return
    setDims({
      trackW: t.scrollWidth,
      vw: window.innerWidth,
      vh: window.innerHeight,
      centers: cards.current.slice(0, list.length).map((c) => (c ? c.offsetLeft + c.offsetWidth / 2 : 0)),
    })
  }, [list.length])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [measure])

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setProg(clamp(-r.top / Math.max(1, el.offsetHeight - window.innerHeight)))
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on) }
  }, [])

  const pickFilter = (f: Filter) => {
    setFilter(f)
    const el = wrap.current
    if (el && window.scrollY > el.offsetTop) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }

  const travel = Math.max(0, dims.trackW - dims.vw)
  const x = -prog * travel
  const sectionH = travel + dims.vh
  const activeIdx = dims.centers.reduce((best, c, i) => (Math.abs(c + x - dims.vw / 2) < Math.abs((dims.centers[best] ?? 0) + x - dims.vw / 2) ? i : best), 0)
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + list.length) % list.length)), [list.length])

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const card = (e.target as Element).closest('[data-work]') as HTMLElement | null
    setCursor({ x: e.clientX, y: e.clientY, on: !!card, label: card?.dataset.work === 'Video' ? 'Play' : 'View' })
  }

  if (reduced) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="columns-2 gap-4 md:columns-3">
          {creativeWorks.map((w, i) => (
            <button key={w.driveId} onClick={() => setOpen(i)} className="mb-4 block w-full overflow-hidden rounded-2xl ring-1 ring-mint/10">
              <img src={thumb(w.driveId, 700)} alt={w.title} className="w-full" />
            </button>
          ))}
        </div>
        {open !== null && <Viewer list={creativeWorks} index={open} onClose={() => setOpen(null)} onStep={step} />}
      </section>
    )
  }

  return (
    <section ref={wrap} className="relative" style={{ height: sectionH || '300vh' }} aria-label="Graphics and video portfolio">
      <div className="sticky top-0 h-[100svh] overflow-hidden" onPointerMove={onMove} onPointerLeave={() => setCursor((c) => ({ ...c, on: false }))}>
        {/* giant outlined type drifting behind the reel */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[22vw] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(139,229,213,.14)]"
          style={{ transform: `translate(${-prog * 35}%, -50%)` }}>
          Canva · CapCut · Figma · Canva · CapCut ·
        </div>

        {/* header + filters */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 pt-24 sm:px-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.25em] text-emerald">Selected edits</p>
            <p className="mt-1 font-serif text-3xl text-white sm:text-4xl">The <span className="accent">reel.</span></p>
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

        {/* the curved track */}
        <div className="absolute inset-x-0 bottom-[12vh] top-[30vh] sm:top-[26vh]" style={{ perspective: '1400px' }}>
          <div ref={track} className="flex h-full w-max items-center gap-6 px-[8vw] will-change-transform sm:gap-10" style={{ transform: `translate3d(${x}px,0,0)`, transformStyle: 'preserve-3d' }}>
            {list.map((w, i) => {
              const d = dims.centers[i] !== undefined ? (dims.centers[i] + x - dims.vw / 2) / dims.vw : 0
              const ad = Math.min(Math.abs(d), 1.2)
              return (
                <button
                  key={w.driveId}
                  ref={(el) => { cards.current[i] = el }}
                  data-work={w.group}
                  onClick={() => setOpen(i)}
                  aria-label={`${w.title} (${w.group}), open`}
                  className={`group relative shrink-0 overflow-hidden rounded-[22px] bg-dark ring-1 ring-mint/10 transition-[box-shadow] duration-500 hover:ring-lime/60 md:cursor-none ${w.ratio === 'wide' ? 'aspect-video h-[25vh] sm:h-[44vh]' : 'aspect-[4/5] h-[42vh] sm:h-[54vh]'}`}
                  style={{
                    transform: `translateY(${ad * ad * 50}px) translateZ(${-ad * 160}px) rotateY(${d * -22}deg)`,
                    filter: `brightness(${1 - ad * 0.35})`,
                    boxShadow: i === activeIdx ? '0 30px 80px -30px rgba(46,229,157,.55)' : undefined,
                  }}
                >
                  <img src={thumb(w.driveId)} alt="" draggable={false} loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    className="h-full w-full scale-[1.14] object-cover transition-transform duration-700 group-hover:scale-[1.2]"
                    style={{ translate: `${d * -6}% 0` }} />
                  <span className="absolute inset-0 bg-gradient-to-t from-space/90 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
                  {w.group === 'Video' && (
                    <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime/90 text-space shadow-[0_0_40px] shadow-lime/60 transition group-hover:scale-110">
                      <Play size={24} className="translate-x-[2px] fill-current" />
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left">
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-emerald">{w.group} · {w.tool}</span>
                      <span className="mt-0.5 block font-serif text-xl leading-tight text-white sm:text-2xl">{w.title}</span>
                    </span>
                    <span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* progress */}
        <div className="absolute inset-x-0 bottom-6 mx-auto flex max-w-6xl items-center gap-4 px-4 sm:px-6">
          <span className="font-mono text-xs text-lime">{String(activeIdx + 1).padStart(2, '0')}</span>
          <span className="relative h-px flex-1 bg-mint/15">
            <span className="absolute inset-y-0 left-0 bg-gradient-to-r from-lime via-emerald to-cyan" style={{ width: `${prog * 100}%` }} />
          </span>
          <span className="font-mono text-xs text-muted">{String(list.length).padStart(2, '0')}</span>
        </div>

        {/* custom cursor */}
        <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}>
          <span className={`-ml-11 -mt-11 grid h-22 w-22 place-items-center rounded-full bg-lime font-mono text-xs font-semibold uppercase tracking-widest text-space transition-[scale,opacity] duration-300 ${cursor.on ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            {cursor.label}
          </span>
        </div>
      </div>
      {open !== null && <Viewer list={list} index={open} onClose={() => setOpen(null)} onStep={step} />}
    </section>
  )
}

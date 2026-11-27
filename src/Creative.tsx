import { createPortal } from 'react-dom'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, Play, X } from 'lucide-react'
import { creativeWorks, type CreativeWork } from './data'

// direct Google image host (the thumbnail endpoint redirects here and rate-limits bursts)
const retryImg = (id: string, w: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget
  if (img.dataset.retried) { img.style.display = 'none'; return }
  img.dataset.retried = '1'
  setTimeout(() => { img.src = `https://drive.google.com/thumbnail?id=${id}&sz=w${w}` }, 600 + Math.random() * 1200)
}
const thumb = (id: string, w = 1000) => `https://lh3.googleusercontent.com/d/${id}=w${w}`

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

/* ───────── 3. Curved scrolling walls of work around a still centre ───────── */

type Item = { w: CreativeWork; i: number }

function Column({ items, dir, dur, onOpen, near }: { items: Item[]; dir: 'up' | 'down'; dur: number; onOpen: (i: number, el: HTMLElement) => void; near: boolean }) {
  const loop = [...items, ...items]
  return (
    <div className="wall-col group/col h-full overflow-hidden">
      <div className={`wall-track flex flex-col gap-3 ${dir === 'down' ? 'reverse' : ''}`} style={{ animationDuration: `${dur}s` }}>
        {loop.map(({ w, i }, n) => (
          <button key={`${w.driveId}-${n}`} aria-hidden={n >= items.length} tabIndex={n >= items.length ? -1 : 0}
            onClick={(e) => onOpen(i, e.currentTarget)} aria-label={`Open ${w.title}`}
            className={`group relative block w-full shrink-0 overflow-hidden rounded-xl bg-dark ring-1 ring-mint/10 transition duration-300 hover:ring-lime/70 hover:[box-shadow:0_0_30px_-6px_rgba(214,247,255,.7)] ${w.ratio === 'wide' ? 'aspect-video' : 'aspect-[4/5]'}`}>
            <img src={near ? thumb(w.driveId, 500) : undefined} alt="" draggable={false}
              onError={retryImg(w.driveId, 500)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            {w.group === 'Video' && (
              <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime text-space shadow-[0_0_20px] shadow-lime/70">
                <Play size={14} className="translate-x-[1px] fill-current" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// outer columns bend away the most: a drum seen from inside
const BEND = [
  { ry: 46, tz: -230, op: 0.55 },
  { ry: 30, tz: -110, op: 0.8 },
  { ry: 14, tz: -30, op: 1 },
]

export function CreativeWall() {
  const n = creativeWorks.length
  const sec = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: '1200px' })
    if (sec.current) io.observe(sec.current)
    return () => io.disconnect()
  }, [])
  const [open, setOpen] = useState<{ i: number; origin: DOMRect | null } | null>(null)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const stepOpen = useCallback((d: number) => setOpen((o) => (o ? { i: (o.i + d + n) % n, origin: null } : o)), [n])
  const openAt = (i: number, el: HTMLElement) => setOpen({ i, origin: el.getBoundingClientRect() })
  const [phone, setPhone] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setPhone(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // six columns, each a rotated slice of the work so neighbours differ
  const cols = useMemo(() => {
    const items: Item[] = creativeWorks.map((w, i) => ({ w, i }))
    return Array.from({ length: 6 }, (_, c) => Array.from({ length: 8 }, (_, k) => items[(c * 5 + k * 3) % items.length]))
  }, [])
  const counts = useMemo(() => ({
    campus: creativeWorks.filter((w) => w.group === 'Campus').length,
    client: creativeWorks.filter((w) => w.group === 'Client').length,
    video: creativeWorks.filter((w) => w.group === 'Video').length,
  }), [])

  const wall = (side: 'left' | 'right') => (
    <div className="absolute inset-y-0 hidden w-[31%] md:block" style={{ [side]: 0, perspective: '900px' } as React.CSSProperties}>
      <div className="flex h-full gap-3 px-2" style={{ transformStyle: 'preserve-3d', flexDirection: side === 'left' ? 'row' : 'row-reverse' }}>
        {BEND.map((b, k) => {
          const c = side === 'left' ? k : k + 3
          return (
            <div key={k} className="h-[118%] flex-1 -translate-y-[8%]"
              style={{ transform: `translateZ(${b.tz}px) rotateY(${side === 'left' ? b.ry : -b.ry}deg)`, opacity: b.op, transformOrigin: side === 'left' ? 'right center' : 'left center' }}>
              <Column items={cols[c]} dir={c % 2 ? 'down' : 'up'} dur={reduced ? 0 : 38 + c * 6} onOpen={openAt} near={near} />
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <section id="creative" ref={sec} className="relative h-[100svh] min-h-[680px] overflow-hidden" aria-label="Graphics and video portfolio">
      {!phone && wall('left')}
      {!phone && wall('right')}

      {/* phones: two rolling rows instead of side walls */}
      {phone && <>
      <div className="absolute inset-x-0 top-20 md:hidden" style={{ perspective: '700px' }}>
        <div className="marquee overflow-hidden" style={{ transform: 'rotateX(18deg)' }}>
          <div className="marquee-track gap-3" style={{ animationDuration: '50s' }}>
            {[...cols[0], ...cols[0]].map(({ w, i }, k) => (
              <button key={k} onClick={(e) => openAt(i, e.currentTarget)} aria-label={`Open ${w.title}`} className="h-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-mint/10" style={{ aspectRatio: w.ratio === 'wide' ? '16/9' : '4/5' }}>
                <img src={near ? thumb(w.driveId, 500) : undefined} alt="" onError={retryImg(w.driveId, 500)} className="h-full w-full object-cover text-transparent" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-10 md:hidden" style={{ perspective: '700px' }}>
        <div className="marquee overflow-hidden" style={{ transform: 'rotateX(-18deg)' }}>
          <div className="marquee-track reverse gap-3" style={{ animationDuration: '56s' }}>
            {[...cols[3], ...cols[3]].map(({ w, i }, k) => (
              <button key={k} onClick={(e) => openAt(i, e.currentTarget)} aria-label={`Open ${w.title}`} className="h-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-mint/10" style={{ aspectRatio: w.ratio === 'wide' ? '16/9' : '4/5' }}>
                <img src={near ? thumb(w.driveId, 500) : undefined} alt="" onError={retryImg(w.driveId, 500)} className="h-full w-full object-cover text-transparent" />
              </button>
            ))}
          </div>
        </div>
      </div>

      </>}

      {/* fog: edges + top/bottom fade so the walls dissolve into the scene */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_30%_50%_at_50%_50%,rgba(3,18,26,.94)_45%,rgba(3,18,26,.35)_78%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-space to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-space to-transparent" />

      {/* the still centre */}
      <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col items-center justify-center px-6 text-center">
        <span className="relative">
          <span aria-hidden className="absolute -inset-2 rounded-full bg-[radial-gradient(closest-side,rgba(168,232,244,.35),transparent)] blur-md" />
          <img src={`${import.meta.env.BASE_URL}about/portrait.jpg`} alt="Jethro Mandalones" className="relative h-20 w-20 rounded-full object-cover object-top ring-2 ring-lime/50" />
        </span>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="font-medium text-white">Jethro Mandalones</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-lime">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> Open for design work
          </span>
        </div>
        <p className="eyebrow mt-6">Graphics & video editing</p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Visuals that make people <span className="accent">stop scrolling.</span>
        </h2>
        <p className="mt-4 max-w-md text-muted">
          Campus pubmats, a full social series for a luxury dry-cleaning brand, and video edits, made in Canva, CapCut and Figma.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={() => setOpen({ i: 0, origin: null })}
            className="btn-shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-lime px-6 py-3 font-semibold text-space shadow-[0_0_30px_-8px_rgba(214,247,255,.9)] transition hover:bg-mint">
            <Play size={15} className="fill-current" /> See the work
          </button>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-space/60 px-6 py-3 text-ink backdrop-blur transition hover:border-lime hover:text-white">
            Start a project <ArrowRight size={16} />
          </a>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[.2em] text-muted">
          {counts.campus} campus · {counts.client} client · {counts.video} video · tap any piece
        </p>
      </div>

      {open && <CaseStudy key={open.origin ? `o${open.i}` : 'nav'} list={creativeWorks} index={open.i} origin={open.origin} onClose={() => setOpen(null)} onStep={stepOpen} />}
    </section>
  )
}

import { createPortal } from 'react-dom'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Award, CalendarDays, ExternalLink, Eye, X } from 'lucide-react'
import { certificates, type Certificate } from './data'
import LightStreaks from './fx/LightStreaks'

const thumb = (id: string, w = 1400) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`
const preview = (id: string) => `https://drive.google.com/file/d/${id}/preview`
const view = (id: string) => `https://drive.google.com/file/d/${id}/view`

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/** Pose of certificate i given the continuous scroll position p (0 = first cert landed). */
function pose(i: number, p: number, narrow: boolean) {
  const t = p - i
  if (t <= -1) return { x: 0, y: -40, z: -1900, rx: 42, ry: -32, rz: 0, s: 1, o: 0, b: 1, active: false }
  if (t <= 0) {
    // flying in from deep space
    const k = ease(1 + t)
    return { x: 0, y: -160 * (1 - k), z: -1900 * (1 - k), rx: 42 * (1 - k), ry: -32 * (1 - k), rz: 4 * (1 - k), s: 1, o: clamp(k * 1.6), b: 1, active: t > -0.5 }
  }
  // settling back onto the stack of earned certificates
  const k = ease(clamp(t))
  const older = Math.max(0, t - 1)
  const sx = narrow ? -10 : -46 // % of the card width
  return {
    x: sx * k - older * 3,
    y: (narrow ? -26 : 8) * k - older * 6,
    z: -520 * k - older * 90,
    rx: 6 * k,
    ry: (narrow ? 10 : 34) * k,
    rz: (-7 + (i % 3) * 4) * k,
    s: 1 - 0.28 * k,
    o: clamp(1 - Math.max(0, older - 1.5) * 0.5, 0.3, 1), // stay solid; only very old cards fade
    b: 1 - 0.5 * k - Math.min(older, 2) * 0.1,
    active: t < 0.5,
  }
}

function CertModal({ c, onClose }: { c: Certificate; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={c.title} onClick={onClose}
      className="panel-in fixed inset-0 z-[100] flex flex-col items-center justify-center bg-space/90 p-4 backdrop-blur-md">
      <div className="mb-4 flex w-full max-w-5xl items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-emerald">{c.issuer}</p>
          <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{c.title}</h3>
        </div>
        <button onClick={onClose} aria-label="Close certificate" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-mint/20 text-mint hover:bg-dark">
          <X size={20} />
        </button>
      </div>
      <div onClick={(e) => e.stopPropagation()} className="aspect-[1.414] w-full max-w-5xl overflow-hidden rounded-2xl border border-emerald/30 bg-white shadow-[0_0_80px_-20px] shadow-emerald/50">
        <iframe src={preview(c.driveId)} title={c.title} className="h-full w-full" allow="fullscreen" />
      </div>
      <a href={view(c.driveId)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-mint">
        Open in Google Drive <ExternalLink size={14} />
      </a>
    </div>
  , document.body)
}

function CertCard({ c, style, active, onOpen, shine }: { c: Certificate; style: CSSProperties; active: boolean; onOpen: () => void; shine: number }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      tabIndex={active ? 0 : -1}
      aria-label={`View certificate: ${c.title}`}
      className={`group absolute left-1/2 top-1/2 aspect-[1.414] w-[min(600px,84vw)] rounded-2xl ${active ? 'aurora-ring cursor-zoom-in' : 'pointer-events-none'}`}
      style={style}
    >
      <span className="absolute inset-0 overflow-hidden rounded-2xl bg-[#f4f6f5] shadow-[0_40px_80px_-30px_rgba(0,0,0,.85)]">
        <img src={thumb(c.driveId)} alt="" draggable={false} loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          className="h-full w-full object-cover text-transparent" />
        {/* holographic foil sweep */}
        <span aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background: 'linear-gradient(115deg, transparent 30%, rgba(198,244,50,.55) 44%, rgba(46,229,157,.45) 50%, rgba(34,211,238,.5) 56%, transparent 70%)',
            backgroundSize: '260% 100%',
            backgroundPosition: `${110 - shine * 120}% 0`,
            opacity: active ? 0.85 : 0.25,
          }} />
        <span aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
      </span>
      {active && (
        <span className="absolute -bottom-5 right-5 inline-flex items-center gap-1.5 rounded-full bg-space/90 px-3 py-1.5 font-mono text-[11px] text-lime ring-1 ring-emerald/40 backdrop-blur transition group-hover:bg-emerald group-hover:text-space">
          <Eye size={13} /> Tap to view
        </span>
      )}
    </button>
  )
}

export default function Certificates() {
  const n = certificates.length
  const wrap = useRef<HTMLElement>(null)
  const [prog, setProg] = useState(0)
  const [open, setOpen] = useState<Certificate | null>(null)
  const [narrow, setNarrow] = useState(false)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setProg(clamp(-r.top / Math.max(1, el.offsetHeight - window.innerHeight)))
      setNarrow(window.innerWidth < 768)
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])

  // p runs from -0.7 (first certificate still far away) to n-1, then holds so the last one stays landed
  const SPAN = n - 1 + 0.95
  const p = Math.min(n - 1, -0.7 + prog * SPAN)
  const activeIdx = Math.round(clamp(p, 0, n - 1))
  const c = certificates[activeIdx]

  const jumpTo = (i: number) => {
    const el = wrap.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    const target = (i + 0.7) / SPAN
    window.scrollTo({ top: el.offsetTop + total * target, behavior: 'smooth' })
  }

  const header = (
    <div>
      <p className="eyebrow mb-4 flex items-center gap-3"><span className="h-px w-8 bg-gradient-to-r from-lime to-emerald" />Certificates & seminars</p>
      <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
        Proof I keep <span className="accent">learning.</span>
      </h2>
    </div>
  )

  if (reduced) {
    return (
      <section id="certificates" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10">{header}</div>
        <div className="grid gap-5 sm:grid-cols-2">
          {certificates.map((cert) => (
            <button key={cert.driveId} onClick={() => setOpen(cert)} className="glass overflow-hidden text-left">
              <img src={thumb(cert.driveId, 900)} alt="" className="aspect-[1.414] w-full bg-white object-cover" />
              <div className="p-5">
                <p className="font-mono text-[11px] text-emerald">{cert.issuer} · {cert.date}</p>
                <p className="mt-1 font-display text-lg font-semibold text-white">{cert.title}</p>
              </div>
            </button>
          ))}
        </div>
        {open && <CertModal c={open} onClose={() => setOpen(null)} />}
      </section>
    )
  }

  return (
    <section id="certificates" ref={wrap} className="relative" style={{ height: `${n * 85 + 80}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <LightStreaks className="absolute inset-x-0 top-1/4 -z-0 h-2/3 w-full opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(46,229,157,.14),transparent)] blur-2xl md:left-[62%]" />

        <div className="relative mx-auto grid w-full max-w-6xl flex-1 grid-rows-[auto_1fr_auto] gap-4 px-4 pb-6 pt-24 sm:px-6 md:grid-cols-[0.85fr_1.15fr] md:grid-rows-1 md:items-center md:gap-10 md:pb-0 md:pt-20">
          {/* left: heading + live details */}
          <div className="relative z-10 md:order-1">
            {header}
            <div key={activeIdx} className="panel-in mt-6 hidden md:block">
              <p className="font-mono text-xs text-muted">
                <span className="text-lime">{String(activeIdx + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')} · {c.kind}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">{c.title}</h3>
              <p className="mt-1 flex items-center gap-2 text-mint"><Award size={16} className="text-emerald" />{c.issuer}</p>
              <p className="mt-1 flex items-center gap-2 font-mono text-xs text-muted"><CalendarDays size={14} className="text-emerald" />{c.date}</p>
              <p className="mt-4 max-w-md leading-relaxed text-muted">{c.detail}</p>
              <div className="mt-4 flex flex-wrap gap-2">{c.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            </div>

            {/* timeline rail */}
            <ol className="mt-8 hidden space-y-1 md:block">
              {certificates.map((cert, i) => (
                <li key={cert.driveId}>
                  <button onClick={() => jumpTo(i)} className="group flex w-full items-center gap-3 rounded-lg py-1.5 text-left">
                    <span className={`h-2 w-2 shrink-0 rounded-full transition-all duration-500 ${i === activeIdx ? 'scale-150 bg-lime shadow-[0_0_10px] shadow-lime' : i < activeIdx ? 'bg-emerald/70' : 'bg-mint/20'}`} />
                    <span className={`font-mono text-[11px] transition ${i === activeIdx ? 'text-lime' : 'text-muted group-hover:text-mint'}`}>{cert.date}</span>
                    <span className={`truncate text-sm transition ${i === activeIdx ? 'text-white' : 'text-muted/70 group-hover:text-ink'}`}>{cert.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* right: the 3D stage */}
          <div className="relative min-h-0 md:order-2 md:h-[70vh]" style={{ perspective: '1500px' }}>
            <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              {certificates.map((cert, i) => {
                const q = pose(i, p, narrow)
                const t = p - i
                return (
                  <CertCard
                    key={cert.driveId}
                    c={cert}
                    active={i === activeIdx}
                    onOpen={() => setOpen(cert)}
                    shine={clamp(t + 1, 0, 1.6)}
                    style={{
                      transform: `translate(-50%, -50%) translate3d(${q.x}%, ${q.y}px, ${q.z}px) rotateX(${q.rx}deg) rotateY(${q.ry}deg) rotateZ(${q.rz}deg) scale(${q.s})`,
                      opacity: q.o,
                      filter: `brightness(${q.b})`,
                      zIndex: 100 - Math.round(Math.abs(t) * 10),
                      transition: 'filter .3s',
                      willChange: 'transform, opacity',
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* mobile details */}
          <div key={`m${activeIdx}`} className="panel-in relative z-10 md:hidden">
            <p className="font-mono text-[11px] text-muted"><span className="text-lime">{String(activeIdx + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')} · {c.date}</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-white">{c.title}</h3>
            <p className="text-sm text-mint">{c.issuer}</p>
            <div className="mt-3 flex gap-1.5">
              {certificates.map((cert, i) => (
                <button key={cert.driveId} onClick={() => jumpTo(i)} aria-label={`Go to ${cert.title}`}
                  className={`h-1 rounded-full transition-all duration-500 ${i === activeIdx ? 'w-10 bg-lime' : 'w-5 bg-mint/20'}`} />
              ))}
            </div>
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[.3em] text-mint/60 md:block"
          style={{ opacity: prog > 0.92 ? 0 : 1 }}>
          Keep scrolling · {n - activeIdx - 1 > 0 ? `${n - activeIdx - 1} more` : 'last one'}
        </p>
      </div>
      {open && <CertModal c={open} onClose={() => setOpen(null)} />}
    </section>
  )
}

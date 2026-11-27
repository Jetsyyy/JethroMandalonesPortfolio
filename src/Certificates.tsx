import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Award, CalendarDays, ExternalLink, Eye, RotateCcw, X } from 'lucide-react'
import { certificates, type Certificate } from './data'

// direct Google image host (the thumbnail endpoint redirects here and rate-limits bursts)
const thumb = (id: string, w = 1400) => `https://lh3.googleusercontent.com/d/${id}=w${w}`
const preview = (id: string) => `https://drive.google.com/file/d/${id}/preview`
const view = (id: string) => `https://drive.google.com/file/d/${id}/view`

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

/** One certificate as a flashcard: tap to flip between the certificate and its details. */
function FlashCard({ c, i, onView }: { c: Certificate; i: number; onView: () => void }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="reveal" style={{ transitionDelay: `${i * 90}ms`, perspective: '1400px' }}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${c.title}. ${flipped ? 'Showing details' : 'Showing certificate'}. Press to flip.`}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f) } }}
        className="group relative aspect-[1.414] w-full cursor-pointer outline-none [transform-style:preserve-3d] transition-transform duration-700 [transition-timing-function:cubic-bezier(.3,.7,.2,1)] focus-visible:ring-2 focus-visible:ring-lime/60 rounded-2xl"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'none' }}
      >
        {/* front: the certificate */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[#f3f6f8] shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] ring-1 ring-mint/15 transition duration-300 [backface-visibility:hidden] group-hover:ring-lime/50 group-hover:[box-shadow:0_30px_60px_-30px_rgba(0,0,0,.9),0_0_40px_-10px_rgba(214,247,255,.55)]">
          <img src={thumb(c.driveId, 1000)} alt={c.title} loading="lazy" className="h-full w-full object-cover text-transparent"
            onError={(e) => {
              // Google occasionally hiccups; retry once via the Drive thumbnail endpoint
              const img = e.currentTarget
              if (img.dataset.retried) return
              img.dataset.retried = '1'
              setTimeout(() => { img.src = `https://drive.google.com/thumbnail?id=${c.driveId}&sz=w1000` }, 700)
            }} />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-space/95 via-space/70 to-transparent p-4 pt-14">
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold text-white">{c.title}</p>
              <p className="font-mono text-[11px] text-mint">{c.date}</p>
            </div>
            <span className="shrink-0 rounded-full border border-mint/30 bg-space/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-mint transition group-hover:border-lime/60 group-hover:text-lime">
              Tap to flip
            </span>
          </div>
        </div>

        {/* back: the details */}
        <div className="glass absolute inset-0 flex flex-col !rounded-2xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-aqua">{c.kind}</p>
          <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">{c.title}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-mint"><Award size={15} className="shrink-0 text-lime" />{c.issuer}</p>
          <p className="mt-1 flex items-center gap-2 font-mono text-xs text-muted"><CalendarDays size={13} className="shrink-0 text-lime" />{c.date}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{c.detail}</p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            {c.skills.map((s) => <span key={s} className="chip">{s}</span>)}
            <span className="ml-auto flex gap-2">
              <button type="button" onClick={(e) => { e.stopPropagation(); onView() }}
                className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-xs font-semibold text-space transition hover:bg-mint">
                <Eye size={13} /> View
              </button>
              <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full border border-mint/25 text-muted"><RotateCcw size={13} /></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Certificates() {
  const [open, setOpen] = useState<Certificate | null>(null)
  return (
    <section id="certificates" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-4 flex items-center gap-3"><span className="h-px w-8 bg-gradient-to-r from-lime to-emerald" />Certificates & seminars</p>
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Proof I keep <span className="accent">learning.</span>
          </h2>
        </div>
        <p className="max-w-xs font-mono text-xs leading-relaxed text-muted">Tap a card to flip it for the details. Hit View for the full certificate.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {certificates.map((c, i) => <FlashCard key={c.driveId} c={c} i={i} onView={() => setOpen(c)} />)}
      </div>
      {open && <CertModal c={open} onClose={() => setOpen(null)} />}
    </section>
  )
}

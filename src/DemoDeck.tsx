import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as RKeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import { ArrowLeft, ArrowRight, Monitor, Play, RotateCcw, Smartphone, X } from 'lucide-react'
import { demos, type Demo } from './data'

// direct Google image host (the thumbnail endpoint redirects here and rate-limits bursts)
const thumb = (id: string, w = 900) => `https://lh3.googleusercontent.com/d/${id}=w${w}`
const embed = (id: string) => `https://drive.google.com/file/d/${id}/preview`

/** Shortest signed distance from `active` to `i` on a ring of `n` cards. */
function ringOffset(i: number, active: number, n: number) {
  let o = i - active
  if (o > n / 2) o -= n
  if (o < -n / 2) o += n
  return o
}

function useCardWidth() {
  const [w, setW] = useState(320)
  useEffect(() => {
    const set = () => setW(window.innerWidth < 640 ? Math.min(280, window.innerWidth - 72) : 320)
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])
  return w
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-deep/50">{label}</p>
      <p className="mt-0.5 truncate font-display text-[15px] font-semibold text-[#1E7F98]">{value}</p>
    </div>
  )
}

function CardFront({ d, onPlay, active }: { d: Demo; onPlay: () => void; active: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col rounded-[28px] bg-[#F1F6F8] p-2.5 text-deep shadow-[0_30px_60px_-25px_rgba(0,0,0,.7)] [backface-visibility:hidden]">
      <div className="relative h-[44%] overflow-hidden rounded-[22px] bg-dark">
        <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#3CC4DC33,transparent_60%)] font-display text-4xl font-bold text-aqua/40" aria-hidden>
          {d.title.split(' ').map((w) => w[0]).join('')}
        </span>
        <img src={thumb(d.driveId)} alt={`${d.title} screen`} loading="lazy" draggable={false}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          className="relative h-full w-full object-cover object-top text-transparent transition duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-deep/85 px-2.5 py-1 text-[11px] font-medium text-mint backdrop-blur">
          {d.platform === 'Mobile' ? <Smartphone size={12} /> : <Monitor size={12} />} {d.platform}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
        <h3 className="font-display text-[22px] font-bold leading-tight">{d.title}</h3>
        <p className="mt-1 text-[13px] text-deep/60">{d.kind}</p>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-deep/80">Overview</p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-deep/60">{d.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Platform" value={d.platform} />
          <Stat label="Stack" value={d.stack} />
          <Stat label="Role" value={d.role} />
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-[11px] text-deep/45">{active ? 'Tap card to flip' : 'Tap to bring forward'}</p>
            <p className="font-display text-lg font-bold">Watch demo</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPlay() }}
            tabIndex={active ? 0 : -1}
            aria-label={`Play ${d.title} demo`}
            className="grid h-12 w-12 place-items-center rounded-full bg-deep text-mint transition hover:scale-105 hover:bg-[#1E7F98] hover:text-white"
          >
            <Play size={18} className="translate-x-[1px] fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}

function CardBack({ d, onPlay, active }: { d: Demo; onPlay: () => void; active: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] border border-aqua/40 bg-dark p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
      <img src={thumb(d.driveId, 400)} alt="" aria-hidden onError={(e) => { e.currentTarget.style.display = 'none' }} className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-[.12] blur-sm" />
      <div className="relative flex h-full flex-col">
        <p className="font-mono text-[11px] uppercase tracking-[.2em] text-aqua">{d.kind}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-white">{d.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{d.description}</p>
        <ul className="mt-5 space-y-2.5">
          {d.highlights.map((h, n) => (
            <li key={h} className="flex items-center gap-3 text-sm text-ink">
              <span className="font-mono text-xs text-aqua">0{n + 1}</span>
              <span className="h-px w-4 bg-aqua/40" />
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPlay() }}
            tabIndex={active ? 0 : -1}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-aqua py-3 font-medium text-deep transition hover:bg-mint"
          >
            <Play size={16} className="fill-current" /> Play demo
          </button>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-mint/20 text-muted" aria-hidden>
            <RotateCcw size={16} />
          </span>
        </div>
      </div>
    </div>
  )
}

function VideoModal({ d, onClose }: { d: Demo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${d.title} demo video`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep/90 p-4 backdrop-blur-md panel-in"
      onClick={onClose}>
      <div className="mb-4 flex w-full max-w-5xl items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-aqua">{d.kind}</p>
          <h3 className="font-display text-2xl font-semibold text-white">{d.title}</h3>
        </div>
        <button onClick={onClose} aria-label="Close video" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-mint/20 text-mint hover:bg-dark">
          <X size={20} />
        </button>
      </div>
      <div onClick={(e) => e.stopPropagation()}
        className={`overflow-hidden rounded-2xl border border-mint/15 bg-black shadow-2xl ${d.portrait ? 'aspect-[9/16] h-[78vh] max-w-full' : 'aspect-video w-full max-w-5xl'}`}>
        <iframe src={embed(d.driveId)} title={`${d.title} demo`} allow="autoplay; fullscreen" allowFullScreen className="h-full w-full" />
      </div>
      <a href={`https://drive.google.com/file/d/${d.driveId}/view`} target="_blank" rel="noreferrer"
        onClick={(e) => e.stopPropagation()} className="mt-4 text-sm text-muted underline-offset-4 hover:text-mint hover:underline">
        Video not loading? Open it in Google Drive
      </a>
    </div>
  , document.body)
}

export default function DemoDeck() {
  const n = demos.length
  const cardW = useCardWidth()
  const step = cardW * 0.66
  const [active, setActive] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [playing, setPlaying] = useState<Demo | null>(null)
  const [drag, setDrag] = useState(0)
  const start = useRef<{ x: number; moved: boolean } | null>(null)

  const go = useCallback((dir: number) => {
    setFlipped(false)
    setActive((a) => (a + dir + n) % n)
  }, [n])

  const onKey = (e: RKeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }

  const down = (e: RPointerEvent) => { start.current = { x: e.clientX, moved: false } }
  const move = (e: RPointerEvent) => {
    if (!start.current) return
    const dx = e.clientX - start.current.x
    if (Math.abs(dx) > 6) start.current.moved = true
    setDrag(dx)
  }
  const up = () => {
    if (!start.current) return
    if (drag < -50) go(1)
    else if (drag > 50) go(-1)
    setDrag(0)
    setTimeout(() => (start.current = null), 0)
  }

  const clickCard = (i: number) => {
    if (start.current?.moved) return
    if (i === active) setFlipped((f) => !f)
    else { setFlipped(false); setActive(i) }
  }

  return (
    <div className="relative" onKeyDown={onKey}>
      <div
        className="relative mx-auto h-[500px] touch-pan-y select-none sm:h-[540px]"
        style={{ perspective: '1600px' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
        role="region" aria-roledescription="carousel" aria-label="Project demo videos" tabIndex={0}
      >
        {demos.map((d, i) => {
          const o = ringOffset(i, active, n) + drag / step
          const abs = Math.abs(o)
          const isActive = i === active
          return (
            <div
              key={d.driveId}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${d.title}`}
              aria-hidden={!isActive}
              onClick={() => clickCard(i)}
              className="group absolute left-1/2 top-1/2 cursor-pointer"
              style={{
                width: cardW,
                height: cardW * 1.42,
                zIndex: 20 - Math.round(abs * 2),
                opacity: abs > 2.2 ? 0 : 1,
                filter: `brightness(${1 - Math.min(abs, 2) * 0.28}) saturate(${1 - Math.min(abs, 1) * 0.3})`,
                transform: `translate(-50%, -50%) translateX(${o * step}px) translateZ(${-abs * 140}px) rotateY(${-o * 16}deg) scale(${1 - Math.min(abs, 2) * 0.06})`,
                transition: drag ? 'none' : 'transform .7s cubic-bezier(.2,.8,.2,1), filter .7s, opacity .5s',
              }}
            >
              <div
                className="relative h-full w-full [transform-style:preserve-3d]"
                style={{ transform: isActive && flipped ? 'rotateY(180deg)' : 'none', transition: 'transform .75s cubic-bezier(.3,.7,.2,1)' }}
              >
                <CardFront d={d} active={isActive} onPlay={() => setPlaying(d)} />
                <CardBack d={d} active={isActive} onPlay={() => setPlaying(d)} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button onClick={() => go(-1)} aria-label="Previous demo" className="grid h-12 w-12 place-items-center rounded-full border border-mint/20 text-mint transition hover:border-aqua hover:bg-dark">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2" aria-hidden>
          {demos.map((d, i) => (
            <span key={d.driveId} className={`h-1 rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-aqua' : 'w-4 bg-mint/20'}`} />
          ))}
        </div>
        <span className="w-14 text-center font-mono text-xs text-muted" aria-live="polite">
          {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <button onClick={() => go(1)} aria-label="Next demo" className="grid h-12 w-12 place-items-center rounded-full border border-mint/20 text-mint transition hover:border-aqua hover:bg-dark">
          <ArrowRight size={18} />
        </button>
      </div>

      {playing && <VideoModal d={playing} onClose={() => setPlaying(null)} />}
    </div>
  )
}

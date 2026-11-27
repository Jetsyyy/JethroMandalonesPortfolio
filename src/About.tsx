import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, FileText, MapPin, X } from 'lucide-react'
import { about, profile } from './data'

const asset = (p: string) => `${import.meta.env.BASE_URL}about/${p}`
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

const PROOF_TAGS = [
  { text: 'Capstone lead programmer', pos: 'left-[-6%] top-[14%]', delay: '0s' },
  { text: "Top 6 Dean's Lister", pos: 'right-[-10%] top-[30%]', delay: '1.2s' },
  { text: 'IS Club VP · 300+ students', pos: 'left-[-12%] bottom-[30%]', delay: '.6s' },
  { text: '486 OJT hours', pos: 'right-[-4%] bottom-[14%]', delay: '1.8s' },
]

const WHY = [
  { n: '01', title: 'I speak business first', body: 'BS Information Systems, major in Business Analytics. I start from your goals, your data and your users, then pick the tech.' },
  { n: '02', title: 'I ship end to end', body: 'Laravel, React, Flutter and AI integrations: one person from database to deployed product, so nothing gets lost in handoffs.' },
  { n: '03', title: 'I lead and deliver', body: 'Vice President of the IS Club, lead programmer on our capstone, and the one who keeps 300+ students and faculty in sync.' },
]

const MOMENTS = [
  { src: 'ict-week-2026.jpg', title: 'Digital Ascension · ICT Week 2026', note: 'On stage at the IS Club ICT Week', rot: -7 },
  { src: 'arduino-crash-course.jpg', title: 'Arduino Microprocessor Crash Course', note: 'IS Club workshop, CCST', rot: 4 },
  { src: 'data-analytics-seminar.jpg', title: 'Data Analytics for Accounting & Business Decisions', note: 'Joint seminar with the College of Accountancy', rot: -3 },
]

function Lightbox({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [onClose])
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} onClick={onClose}
      className="panel-in fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-space/95 p-4 backdrop-blur-md">
      <button onClick={onClose} aria-label="Close photo" className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-mint/25 text-mint hover:border-lime hover:text-lime sm:right-8 sm:top-8"><X size={20} /></button>
      <img src={src} alt={title} className="max-h-[80vh] max-w-full rounded-2xl ring-1 ring-mint/20" onClick={(e) => e.stopPropagation()} />
      <p className="font-serif text-2xl italic text-white">{title}</p>
    </div>,
    document.body,
  )
}

export default function About() {
  const wrap = useRef<HTMLElement>(null)
  const [p, setP] = useState(0)          // -1..1 as the section passes through the viewport
  const [dealt, setDealt] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      setP(clamp((vh - r.top) / (vh + r.height), 0, 1) * 2 - 1)
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])

  const strip = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setDealt(true), io.disconnect()), { threshold: 0.3 })
    if (strip.current) io.observe(strip.current)
    return () => io.disconnect()
  }, [])

  const drift = reduced ? 0 : p * -18 // % the giant word slides as you scroll
  const WORD = 'JETHRO · BUILDER · ANALYST · LEADER · '

  return (
    <section id="about" ref={wrap} className="relative overflow-hidden py-24 md:py-32">
      {/* ── portrait stage with the giant word around it ── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <p className="eyebrow relative z-30 mb-6 flex items-center gap-3"><span className="h-px w-8 bg-gradient-to-r from-lime to-emerald" />About me</p>

        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* left: portrait */}
          <div className="relative mx-auto w-full max-w-[440px]">
            {/* giant solid word BEHIND the portrait */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[34%] z-0 w-[260vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden lg:w-[200vw]">
              <p className="whitespace-nowrap font-display text-[30vw] font-bold leading-none tracking-[-.04em] text-[#0B2A36] lg:text-[17vw]"
                style={{ transform: `translateX(${drift}%)` }}>{WORD}{WORD}</p>
            </div>

            <div className="relative z-10 aspect-[737/1031]" style={{ transform: reduced ? undefined : `translateY(${p * -24}px)` }}>
              {/* ice rim light */}
              <div aria-hidden className="absolute -inset-6 rounded-t-full bg-[radial-gradient(closest-side,rgba(168,232,244,.22),transparent)] blur-2xl" />
              <div className="relative h-full overflow-hidden rounded-t-full ring-1 ring-mint/25 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]">
                <img src={asset('portrait.jpg')} alt="Portrait of Jethro Katigbak Mandalones in a barong" loading="lazy"
                  className="h-full w-full object-cover object-top saturate-[.85]"
                  style={{ transform: reduced ? undefined : `scale(${1.08 - Math.abs(p) * 0.06})` }} />
                {/* petrol grade so the photo sits in the scene */}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-deep via-deep/10 to-transparent mix-blend-multiply" />
                <div aria-hidden className="absolute inset-0 bg-[#3CC4DC]/10 mix-blend-soft-light" />
              </div>

              {/* outlined copy of the word OVER the portrait: reads as if it wraps around you */}
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-full [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]">
                <div className="absolute left-1/2 top-[34%] w-[260vw] -translate-x-1/2 -translate-y-1/2 lg:w-[200vw]">
                  <p className="whitespace-nowrap font-display text-[30vw] font-bold leading-none tracking-[-.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(214,247,255,.55)] lg:text-[17vw]"
                    style={{ transform: `translateX(${drift}%)` }}>{WORD}{WORD}</p>
                </div>
              </div>

              {/* floating proof tags */}
              {PROOF_TAGS.map((t) => (
                <span key={t.text} className={`glass animate-float absolute z-20 hidden whitespace-nowrap !rounded-full px-4 py-2 font-mono text-[11px] text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] sm:block ${t.pos}`}
                  style={{ animationDelay: t.delay }}>
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px] shadow-lime" />{t.text}
                </span>
              ))}

              <p className="absolute inset-x-0 bottom-3 z-20 text-center font-mono text-[10px] uppercase tracking-[.3em] text-mint/70">
                <MapPin size={11} className="mr-1 inline -translate-y-px" />{profile.location}
              </p>
            </div>
          </div>

          {/* right: the pitch */}
          <div className="relative z-20">
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hi, I'm Jethro. I <span className="accent">translate</span> business problems into software that works.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{about.paragraphs[1]}</p>

            <ol className="mt-10 space-y-6">
              {WHY.map((w) => (
                <li key={w.n} className="group grid grid-cols-[auto_1fr] gap-5 border-t border-mint/10 pt-6">
                  <span className="font-serif text-4xl italic leading-none text-lime/80 transition group-hover:text-lime">{w.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{w.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted">{w.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 font-semibold text-space transition hover:bg-mint">
                Let's build yours <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </a>
              <a href={profile.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-mint/25 px-6 py-3.5 text-ink transition hover:border-lime hover:text-lime">
                <FileText size={17} /> View CV
              </a>
              <div className="ml-auto hidden gap-6 sm:flex">
                {about.stats.map((s) => (
                  <div key={s.label} className="text-right">
                    <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── proof, not promises: photos dealt onto the table ── */}
      <div ref={strip} className="relative mx-auto mt-24 max-w-7xl px-4 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <p className="font-display text-3xl font-semibold text-white sm:text-4xl">Proof, <span className="accent">not promises.</span></p>
          <p className="max-w-xs font-mono text-xs leading-relaxed text-muted">Real moments from campus: teaching, organizing and showing up. Tap a photo to see it full size.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {MOMENTS.map((m, i) => (
            <button key={m.src} onClick={() => setOpen(i)}
              className="group relative rounded-[18px] bg-[#EEF4F6] p-3 pb-14 text-left shadow-[0_30px_60px_-25px_rgba(0,0,0,.9)] transition-[transform,opacity] duration-[900ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:z-10 hover:!rotate-0 hover:scale-[1.04]"
              style={{
                transform: dealt || reduced ? `rotate(${m.rot}deg)` : `translate(${(1 - i) * 110}%, 60px) rotate(${m.rot * 3}deg) scale(.9)`,
                opacity: dealt || reduced ? 1 : 0,
                transitionDelay: `${i * 140}ms`,
              }}>
              <span className="block aspect-[4/3] overflow-hidden rounded-[10px] bg-dark">
                <img src={asset(m.src)} alt={m.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </span>
              <span className="absolute inset-x-4 bottom-3">
                <span className="block truncate font-serif text-lg italic leading-tight text-[#062430]">{m.title}</span>
                <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-[#4E7381]">{m.note}</span>
              </span>
              {/* tape */}
              <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] rounded-sm bg-[#A8E8F4]/50 backdrop-blur-sm" />
            </button>
          ))}
        </div>
      </div>

      {open !== null && <Lightbox src={asset(MOMENTS[open].src)} title={MOMENTS[open].title} onClose={() => setOpen(null)} />}
    </section>
  )
}

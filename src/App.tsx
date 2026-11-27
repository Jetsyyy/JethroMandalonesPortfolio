import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight, Award, BarChart3, Brain, Briefcase, Check, Code2, Compass,
  FileText, GraduationCap, Layout, MapPin, Menu, Palette, Server,
  Smartphone, Users, Wrench, X,
} from 'lucide-react'
import {
  education, experience, leadership, leadershipSummary, pitch, profile,
  projects, qualifications, services, specializations, techStack, type Project,
} from './data'
import DemoDeck from './DemoDeck'
import Galaxy from './fx/Galaxy'
import LightStreaks from './fx/LightStreaks'
import FlowDiagram from './fx/FlowDiagram'
import useSpotlight from './fx/useSpotlight'
import Hero from './Hero'
import About from './About'
import SkillPill from './SkillPill'
import Contact from './Contact'
import Certificates from './Certificates'
import { CreativeWall } from './Creative'
import AIShowcase from './AIShowcase'

const NAV = [
  { id: 'services', label: 'Services' },
  { id: 'ai', label: 'AI' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'demos', label: 'Demos' },
  { id: 'projects', label: 'Work' },
  { id: 'creative', label: 'Creative' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'certificates', label: 'Certs' },
]

const STACK_ICONS: Record<string, ReactNode> = {
  Languages: <Code2 size={18} />,
  'Frameworks & Libraries': <Layout size={18} />,
  'Databases & Backend': <Server size={18} />,
  'AI & Emerging Tech': <Brain size={18} />,
  'Dev Tools & Platforms': <Wrench size={18} />,
  'Design & Productivity': <Palette size={18} />,
}

const SERVICE_ICONS: Record<string, ReactNode> = {
  build: <Code2 />,
  ai: <Brain />,
  analyze: <BarChart3 />,
  mobile: <Smartphone />,
  design: <Palette />,
  plan: <Compass />,
}

/* Brand icons (inline so they never depend on an icon library version) */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useCycle(length: number, ms = 2400) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % length), ms)
    return () => clearInterval(t)
  }, [length, ms])
  return i
}

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: ReactNode; intro?: string; children: ReactNode }) {
  return (
    <section id={id} className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="reveal mb-12 max-w-3xl">
        <p className="eyebrow mb-4 flex items-center gap-3"><span className="h-px w-8 bg-gradient-to-r from-lime to-emerald" />{eyebrow}</p>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">{title}</h2>
        {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

function Logo() {
  return (
    <span className="logo-breathe grid h-9 w-9 place-items-center rounded-xl border border-aqua/50 bg-dark font-display text-sm font-bold text-aqua">
      <span>J<span className="text-mint">M</span></span>
    </span>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [pill, setPill] = useState({ left: 0, width: 0, show: false })
  const listRef = useRef<HTMLUListElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  // scroll spy + page progress
  useEffect(() => {
    let raf = 0
    const update = () => {
      setScrolled(window.scrollY > 20)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
      const probe = window.innerHeight * 0.35
      let current: string | null = null
      for (const n of NAV) {
        const el = document.getElementById(n.id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= probe && r.bottom > probe) current = n.id
      }
      setActive(current)
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])

  // slide the glowing pill under the active link
  useEffect(() => {
    const place = () => {
      const a = active ? linkRefs.current[active] : null
      const ul = listRef.current
      if (!a || !ul) return setPill((p) => ({ ...p, show: false }))
      const ar = a.getBoundingClientRect(), ur = ul.getBoundingClientRect()
      setPill({ left: ar.left - ur.left, width: ar.width, show: true })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active, scrolled])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`relative mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 ${scrolled ? 'glass !rounded-2xl mx-3 sm:mx-auto py-2.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,.6),0_0_0_1px_rgba(168,232,244,.06)]' : ''}`}>
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Home">
          <Logo />
          <span className="hidden font-display font-semibold text-white transition group-hover:[text-shadow:0_0_14px_rgba(168,232,244,.7)] sm:inline">Jethro M.</span>
        </a>

        <ul ref={listRef} className="relative hidden items-center gap-0.5 xl:flex">
          {/* sliding glow pill under the section you're in */}
          <span aria-hidden className="pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-full border border-lime/40 bg-gradient-to-b from-lime/15 to-aqua/5 shadow-[0_0_22px_-2px_rgba(214,247,255,.45),inset_0_1px_0_rgba(255,255,255,.12)] transition-all duration-500 [transition-timing-function:cubic-bezier(.2,.8,.2,1)]"
            style={{ left: pill.left, width: pill.width, opacity: pill.show ? 1 : 0 }} />
          {NAV.map((n) => {
            const on = active === n.id
            return (
              <li key={n.id} className="relative">
                <a ref={(el) => { linkRefs.current[n.id] = el }} href={`#${n.id}`} aria-current={on ? 'true' : undefined}
                  className={`relative block rounded-full px-3 py-2 text-sm transition duration-300 ${on ? 'text-white [text-shadow:0_0_12px_rgba(214,247,255,.8)]' : 'text-muted hover:text-white hover:[text-shadow:0_0_12px_rgba(168,232,244,.75)]'}`}>
                  {n.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="btn-shine relative hidden items-center gap-1.5 overflow-hidden rounded-full bg-aqua px-4 py-2 text-sm font-medium text-deep shadow-[0_0_24px_-6px_rgba(60,196,220,.8)] transition hover:bg-mint hover:shadow-[0_0_32px_-4px_rgba(168,232,244,.95)] sm:inline-flex">
            Hire me <ArrowRight size={15} />
          </a>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-lg text-mint transition hover:[filter:drop-shadow(0_0_8px_rgba(168,232,244,.8))] xl:hidden" aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* page scroll progress, glowing along the bottom edge */}
        {scrolled && (
          <span aria-hidden className="pointer-events-none absolute inset-x-4 -bottom-px h-px overflow-hidden rounded-full">
            <span className="block h-full origin-left bg-gradient-to-r from-cyan via-aqua to-lime shadow-[0_0_10px_1px_rgba(168,232,244,.8)]"
              style={{ transform: `scaleX(${progress})` }} />
          </span>
        )}
      </nav>
      {open && (
        <ul className="glass panel-in mx-3 mt-2 flex flex-col p-2 xl:hidden">
          {[...NAV, { id: 'contact', label: 'Hire me' }].map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${active === n.id ? 'bg-aqua/10 text-white [text-shadow:0_0_12px_rgba(214,247,255,.7)]' : 'text-muted hover:bg-aqua/10 hover:text-mint'}`}>
                <span className={`h-1.5 w-1.5 rounded-full transition ${active === n.id ? 'bg-lime shadow-[0_0_8px] shadow-lime' : 'bg-mint/20'}`} />
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

/* ───────────── Services: what you can hire me for ───────────── */
function Services() {
  return (
    <Section
      id="services"
      eyebrow="What I do"
      title={<>Built to work. <span className="accent">Designed to sell.</span></>}
      intro="One developer who can take a project from requirements to a launched product. Pick what you need."
    >
      <LightStreaks className="absolute -top-10 left-1/2 -z-10 h-[520px] w-[140vw] max-w-none -translate-x-1/2 opacity-70" />

      <div className="reveal glass spotlight mb-5 overflow-hidden !rounded-3xl p-5 sm:p-7">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="font-mono text-[11px] uppercase tracking-[.25em] text-emerald">● How a project flows</p>
          <p className="font-mono text-[11px] text-muted">7 steps · 1 developer · 0 handoffs</p>
          <p className="font-mono text-[11px] text-lime/80 sm:hidden">Swipe the diagram →</p>
        </div>
        <FlowDiagram />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, n) => (
          <article key={s.key} className="reveal glass glass-hover spotlight group relative p-7" style={{ transitionDelay: `${n * 60}ms` }}>
            <div className="mb-6 flex items-start justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald/30 via-aqua/15 to-cyan/10 text-mint ring-1 ring-emerald/30 transition duration-500 group-hover:from-lime/40 group-hover:text-lime group-hover:shadow-[0_0_30px_-6px] group-hover:shadow-emerald/70 [&>svg]:h-6 [&>svg]:w-6">
                {SERVICE_ICONS[s.key]}
              </div>
              <span className="font-mono text-xs text-muted transition group-hover:text-lime">0{n + 1}</span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-white">{s.title}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-emerald">{s.tag}</p>
            <p className="mt-4 leading-relaxed text-muted">{s.body}</p>
            <ul className="mt-5 space-y-2 border-t border-mint/10 pt-4">
              {s.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-sm text-ink"><Check size={15} className="shrink-0 text-aqua" />{d}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}

function Qualifications() {
  const icons = [<Code2 />, <Brain />, <BarChart3 />, <Layout />, <FileText />, <Users />]
  return (
    <Section id="qualifications" eyebrow="Qualifications & education" title={<>What I bring to <span className="accent">a team.</span></>}>
      <div className="reveal glass relative mb-5 grid gap-6 overflow-hidden p-7 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aqua/15 blur-3xl" />
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-aqua/10 text-aqua"><GraduationCap size={28} /></div>
        <div>
          <h3 className="font-display text-2xl font-semibold text-white">{education.degree}</h3>
          <p className="text-mint">{education.major}</p>
          <p className="mt-1 text-sm text-muted">{education.school}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {education.honors.map((h) => <span key={h} className="chip">{h}</span>)}
          </div>
        </div>
        <span className="font-mono text-sm text-aqua md:self-start">{education.years}</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {qualifications.map((q, n) => (
          <div key={q.title} className="reveal glass glass-hover spotlight p-6" style={{ transitionDelay: `${n * 60}ms` }}>
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-aqua/10 text-aqua [&>svg]:h-5 [&>svg]:w-5">{icons[n]}</div>
            <h3 className="font-display text-lg font-semibold text-white">{q.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{q.body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ───────────── Skills: marquee + grouped grid ───────────── */
function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items]
  return (
    <div className="marquee overflow-hidden py-1.5">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`}>
        {loop.map((t, n) => (
          <span key={t + n} aria-hidden={n >= items.length}><SkillPill name={t} size="lg" /></span>
        ))}
      </div>
    </div>
  )
}

function Stack() {
  const all = techStack.flatMap((g) => g.items)
  const half = Math.ceil(all.length / 2)
  return (
    <section id="stack" className="py-20 md:py-28">
      <div className="reveal mx-auto mb-12 max-w-6xl px-4 text-center sm:px-6">
        <p className="eyebrow mb-3">Technical skills</p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
          From database <span className="accent">to dashboard.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">Backend, frontend, AI and mobile, all handled by one person, so nothing gets lost between teams.</p>
      </div>
      <div className="reveal space-y-3">
        <Marquee items={all.slice(0, half)} />
        <Marquee items={all.slice(half)} reverse />
      </div>
      {/* what I'm strongest at */}
      <div className="reveal glass spotlight mx-4 mt-14 max-w-6xl !rounded-3xl p-6 sm:mx-6 sm:p-8 xl:mx-auto">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <p className="font-display text-2xl font-semibold text-white sm:text-3xl">What I'm <span className="accent">strongest at.</span></p>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-muted">{specializations.length} specializations · backed by real projects</p>
        </div>
        <ol className="grid gap-x-10 md:grid-cols-2">
          {specializations.map((s, i) => (
            <li key={s.area} className="group flex items-baseline gap-4 border-t border-mint/10 py-4 transition-colors hover:border-lime/40">
              <span className="w-7 shrink-0 font-mono text-xs text-aqua transition group-hover:text-lime">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1">
                <span className="block font-display text-lg font-semibold text-white">{s.area}</span>
                <span className="mt-0.5 block font-mono text-xs text-muted transition group-hover:text-mint">{s.via}</span>
              </span>
              <span aria-hidden className="h-px w-0 self-center bg-gradient-to-r from-lime to-transparent transition-all duration-500 group-hover:w-10" />
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-5 grid max-w-6xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {techStack.map((g) => (
          <div key={g.group} className="reveal glass glass-hover spotlight p-6">
            <div className="mb-4 flex items-center gap-2.5 text-aqua">
              {STACK_ICONS[g.group]}
              <h3 className="font-mono text-sm uppercase tracking-widest">{g.group}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((t) => (
                <SkillPill key={t} name={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Professional experience" title={<>Where I've <span className="accent">worked.</span></>}>
      <ol className="relative ml-3 border-l border-transparent [border-image:linear-gradient(to_bottom,#D6F7FF,#6FD6EA_40%,#4C9BC4_80%,transparent)_1]">
        {experience.map((e) => (
          <li key={e.role + e.org} className="reveal relative mb-8 pl-8 last:mb-0">
            <span className="absolute -left-[7px] top-7 h-3.5 w-3.5 rounded-full border-2 border-emerald bg-space shadow-[0_0_14px_2px] shadow-emerald/60" />
            <div className="glass glass-hover spotlight p-6 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl font-semibold text-white">{e.role}</h3>
                <span className="font-mono text-xs text-aqua">{e.period}</span>
              </div>
              <p className="mt-1 text-mint">{e.org}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
                <span className="inline-flex items-center gap-1.5"><Briefcase size={13} className="text-aqua" />{e.type}</span>
                {e.location && <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-aqua" />{e.location}</span>}
              </p>
              <ul className="mt-4 space-y-2">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />{pt}
                  </li>
                ))}
              </ul>
              {e.tech && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-mint/10 pt-4">
                  {e.tech.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/* ───────────── Demos: proof of work, swipeable flip cards ───────────── */
function Demos() {
  return (
    <section id="demos" className="relative overflow-hidden py-20 md:py-28">
      <div className="reveal mx-auto mb-6 flex max-w-6xl flex-wrap items-end justify-between gap-6 px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="eyebrow mb-3">Proof of work</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Don't take my word for it. <span className="accent">Watch it run.</span>
          </h2>
        </div>
        <p className="max-w-xs font-mono text-xs leading-relaxed text-muted">
          Swipe or use ← → to browse. Tap the front card to flip it, or hit play to watch the recorded demo.
        </p>
      </div>
      <div className="reveal">
        <DemoDeck />
      </div>
    </section>
  )
}

/* ───────────── Work: tabbed showcase in a browser frame ───────────── */
function ProjectMock({ kind }: { kind: Project['mock'] }) {
  if (kind === 'analytics') {
    const bars = [38, 52, 45, 63, 58, 74, 69, 86]
    return (
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          {['Stock levels', '30-day forecast', 'Reorder alerts'].map((l, i) => (
            <div key={l} className="rounded-lg border border-mint/10 bg-deep/70 p-3">
              <p className="text-[10px] text-muted">{l}</p>
              <span className="mt-2 block h-3 rounded bg-mint/30" style={{ width: `${[70, 55, 40][i]}%` }} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-2 rounded-lg border border-mint/10 bg-deep/70 p-4">
          {bars.map((h, i) => (
            <div key={i} className={`flex-1 rounded-t ${i > 5 ? 'border border-dashed border-mint/60 bg-mint/15' : 'bg-gradient-to-t from-aqua/40 to-aqua'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    )
  }
  if (kind === 'chat') {
    return (
      <div className="flex h-full flex-col justify-end gap-3">
        <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-dark px-4 py-2.5 text-sm text-ink">Let's practise a job interview. Tell me about yourself.</div>
        <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-sm bg-aqua px-4 py-2.5 text-sm text-deep">I'm an IS graduate who loves building…</div>
        <div className="max-w-[75%] rounded-2xl rounded-bl-sm border border-aqua/40 bg-dark px-4 py-2.5 text-sm text-mint">Nice pacing! Try stressing “building” a little more.</div>
        <div className="flex items-center gap-1 self-center pt-1">
          {[10, 18, 26, 14, 22, 30, 16, 24, 12].map((h, i) => <span key={i} className="w-1 rounded-full bg-aqua" style={{ height: h }} />)}
        </div>
      </div>
    )
  }
  if (kind === 'mobile') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-40 rounded-[1.6rem] border-4 border-dark bg-deep p-3 shadow-xl shadow-black/40">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-dark" />
          <p className="text-[10px] text-muted">Today's lesson</p>
          <p className="font-display text-sm font-semibold text-white">Algebra basics</p>
          <div className="mt-3 h-1.5 rounded-full bg-dark"><div className="h-full w-2/3 rounded-full bg-aqua" /></div>
          {['Ask your AI tutor', 'Practice set', 'Review notes'].map((t) => (
            <div key={t} className="mt-2 rounded-lg bg-dark px-2.5 py-2 text-[10px] text-ink">{t}</div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between rounded-lg bg-deep/70 px-3 py-2">
        <span className="h-2 w-16 rounded bg-aqua/70" />
        <span className="flex gap-2">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-8 rounded bg-mint/20" />)}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center rounded-lg bg-gradient-to-br from-aqua/20 to-deep p-5">
        <span className="h-3 w-2/3 rounded bg-white/80" />
        <span className="mt-2 h-3 w-1/2 rounded bg-white/50" />
        <span className="mt-4 h-6 w-24 rounded-full bg-aqua" />
      </div>
      <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map((i) => <span key={i} className="h-12 rounded-lg border border-mint/10 bg-deep/70" />)}</div>
    </div>
  )
}

function Projects() {
  const [active, setActive] = useState(0)
  const p = projects[active]
  const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return (
    <Section id="projects" eyebrow="Featured work" title={<>Systems I've <span className="accent">shipped.</span></>}>
      <div className="reveal">
        <div role="tablist" aria-label="Projects" className="glass mx-auto mb-8 flex max-w-full gap-1 overflow-x-auto !rounded-full p-1.5 sm:w-fit">
          {projects.map((pr, n) => (
            <button
              key={pr.title}
              role="tab"
              aria-selected={n === active}
              onClick={() => setActive(n)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${n === active ? 'bg-aqua font-medium text-deep' : 'text-muted hover:text-mint'}`}
            >
              {pr.title.replace(' Products Inc.', '')}
            </button>
          ))}
        </div>

        <div key={active} className="panel-in grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div className="glass overflow-hidden !rounded-2xl">
            <div className="flex items-center gap-2 border-b border-mint/10 bg-deep/60 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-mint/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint/30" />
              <span className="ml-3 truncate rounded-md bg-dark px-3 py-1 font-mono text-xs text-muted">work/{slug}</span>
            </div>
            <div className="h-72 bg-gradient-to-br from-dark/80 to-deep p-5 sm:h-80">
              <ProjectMock kind={p.mock} />
            </div>
          </div>
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {p.featured && <span className="chip !border-aqua !bg-aqua !text-deep">Featured</span>}
              {p.badge && <span className="chip inline-flex items-center gap-1"><Award size={12} /> {p.badge}</span>}
            </div>
            <h3 className="font-display text-3xl font-semibold text-white">{p.title}</h3>
            <p className="mt-1 text-lg text-mint">{p.kind}</p>
            <p className="mt-4 leading-relaxed text-muted">{p.description}</p>
            <p className="mt-5 flex items-center gap-2 font-mono text-xs text-muted"><Briefcase size={14} className="text-aqua" /> {p.role}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tech.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Leadership() {
  const top = leadership.find((l) => l.highlight)!
  const rest = leadership.filter((l) => !l.highlight)
  return (
    <Section id="leadership" eyebrow="Leadership & achievements" title={<>Leading beyond <span className="accent">the code.</span></>}>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="reveal glass relative overflow-hidden p-8">
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-aqua/15 blur-3xl" />
          <Users className="mb-5 text-aqua" size={28} />
          <p className="font-mono text-xs text-aqua">{top.period}</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-white">{top.role}</h3>
          <p className="text-lg text-mint">{top.org}</p>
          <p className="mt-5 leading-relaxed text-muted">{leadershipSummary}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {rest.map((l) => (
              <li key={l.role + l.org} className="rounded-xl border border-mint/10 bg-deep/50 px-4 py-3">
                <p className="text-sm font-medium text-ink">{l.role}</p>
                <p className="text-xs text-muted">{l.org}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal glass p-8">
          <div className="mb-5 flex items-center gap-3 text-aqua"><Award size={24} /><span className="eyebrow">Recognition</span></div>
          <ul className="space-y-3">
            {education.honors.map((h, n) => (
              <li key={h} className="glass-hover flex items-center gap-4 rounded-xl border border-mint/10 bg-deep/50 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-aqua/10 font-display font-bold text-aqua">{n + 1}</span>
                <span className="font-medium text-ink">{h}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-xs text-muted">{education.school}</p>
        </div>
      </div>
    </Section>
  )
}

/* ───────────── "I build ___" statement band ───────────── */
function BuildBand() {
  const i = useCycle(pitch.buildWords.length, 2200)
  return (
    <section className="relative overflow-hidden py-28 md:py-40" aria-label="What I build">
      <LightStreaks className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua/10 blur-[110px]" />
      <h2 className="relative flex flex-wrap items-center justify-center gap-x-5 gap-y-4 px-4 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
        I build
        <span className="aurora-ring inline-grid min-w-[7ch] place-items-center rounded-full bg-space/85 px-8 py-3 shadow-[0_0_80px_-10px] shadow-emerald/50 backdrop-blur sm:px-10 sm:py-4">
          <span key={i} className="word-rise whitespace-nowrap"><span className="accent-solid">{pitch.buildWords[i]}</span></span>
        </span>
      </h2>
    </section>
  )
}

export default function App() {
  useReveal()
  useSpotlight()
  return (
    <>
      <Navbar />
      <Galaxy />
      <main className="relative z-10">
        <Hero />
        <Services />
        <AIShowcase />
        <About />
        <Qualifications />
        <Stack />
        <Experience />
        <Demos />
        <Projects />
        <CreativeWall />
        <Leadership />
        <Certificates />
        <BuildBand />
        <Contact />
      </main>
      <footer className="relative z-10 border-t border-mint/10 py-8 text-center font-mono text-xs text-muted">
        © {new Date().getFullYear()} {profile.name} · San Pablo City, Laguna
      </footer>
    </>
  )
}

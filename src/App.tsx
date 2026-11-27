import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowRight, Award, BarChart3, Brain, Briefcase, Check, Code2, Compass,
  Database, FileText, GraduationCap, Layout, Mail, MapPin, Menu, Palette, Server,
  Smartphone, Users, Wrench, X,
} from 'lucide-react'
import {
  about, education, experience, leadership, leadershipSummary, pitch, profile,
  projects, qualifications, services, techStack, type Project,
} from './data'
import DemoDeck from './DemoDeck'
import Hero from './Hero'

const NAV = [
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'demos', label: 'Demos' },
  { id: 'projects', label: 'Work' },
  { id: 'leadership', label: 'Leadership' },
]

const STACK_ICONS: Record<string, ReactNode> = {
  Backend: <Server size={18} />,
  Frontend: <Layout size={18} />,
  Database: <Database size={18} />,
  'AI Integration': <Brain size={18} />,
  Mobile: <Smartphone size={18} />,
  Tools: <Wrench size={18} />,
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
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
)

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
    <section id={id} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="reveal mb-12 max-w-2xl">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
        {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

function Logo() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-xl border border-aqua/50 bg-dark font-display text-sm font-bold text-aqua">
      <span>J<span className="text-mint">M</span></span>
    </span>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 ${scrolled ? 'glass !rounded-2xl mx-3 sm:mx-auto py-2.5 shadow-lg shadow-black/30' : ''}`}>
        <a href="#top" className="flex items-center gap-2.5" aria-label="Home">
          <Logo />
          <span className="hidden font-display font-semibold text-white sm:inline">Jethro M.</span>
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-mint">{n.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden items-center gap-1.5 rounded-full bg-aqua px-4 py-2 text-sm font-medium text-deep transition hover:bg-mint sm:inline-flex">
            Hire me <ArrowRight size={15} />
          </a>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-lg text-mint lg:hidden" aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="glass mx-3 mt-2 flex flex-col p-2 lg:hidden">
          {[...NAV, { id: 'contact', label: 'Hire me' }].map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-muted hover:bg-aqua/10 hover:text-mint">{n.label}</a>
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
      title={<>Built to work. <span className="text-aqua">Designed to sell.</span></>}
      intro="One developer who can take a project from requirements to a launched product. Pick what you need."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, n) => (
          <article key={s.key} className="reveal glass glass-hover group relative overflow-hidden p-7" style={{ transitionDelay: `${n * 60}ms` }}>
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-aqua/0 blur-3xl transition duration-500 group-hover:bg-aqua/20" />
            <div className="mb-6 flex items-start justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-aqua/30 bg-gradient-to-br from-aqua/25 to-dark text-mint [&>svg]:h-6 [&>svg]:w-6">
                {SERVICE_ICONS[s.key]}
              </div>
              <span className="font-mono text-xs text-muted">0{n + 1}</span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-white">{s.title}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-aqua">{s.tag}</p>
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

function About() {
  return (
    <Section id="about" eyebrow="About me" title="Where code meets business">
      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="reveal glass p-7 sm:p-9">
          {about.paragraphs.map((p) => <p key={p} className="mb-4 leading-relaxed text-muted last:mb-0">{p}</p>)}
          <div className="mt-6 flex flex-wrap gap-2">
            {about.focus.map((f) => <span key={f} className="chip">{f}</span>)}
          </div>
        </div>
        <div className="grid content-start gap-6">
          <div className="reveal glass p-7">
            <p className="eyebrow mb-3">Currently</p>
            <p className="font-display text-xl font-semibold text-white">Full-Stack Developer · AI Integration</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><MapPin size={15} className="text-aqua" /> {profile.location}</p>
          </div>
          <div className="reveal grid grid-cols-3 gap-3">
            {about.stats.map((s) => (
              <div key={s.label} className="glass p-4 text-center">
                <div className="font-display text-2xl font-bold text-aqua sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

function Qualifications() {
  const icons = [<Code2 />, <Brain />, <BarChart3 />, <Layout />, <FileText />, <Users />]
  return (
    <Section id="qualifications" eyebrow="Qualifications & education" title="What I bring to a team">
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
          <div key={q.title} className="reveal glass glass-hover p-6" style={{ transitionDelay: `${n * 60}ms` }}>
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
          <span key={t + n} aria-hidden={n >= items.length} className="glass inline-flex items-center gap-2 whitespace-nowrap !rounded-full px-5 py-2.5 text-sm text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />{t}
          </span>
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
          From database <span className="text-aqua">to dashboard.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">Backend, frontend, AI and mobile, all handled by one person, so nothing gets lost between teams.</p>
      </div>
      <div className="reveal space-y-3">
        <Marquee items={all.slice(0, half)} />
        <Marquee items={all.slice(half)} reverse />
      </div>
      <div className="mx-auto mt-14 grid max-w-6xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {techStack.map((g) => (
          <div key={g.group} className="reveal glass glass-hover p-6">
            <div className="mb-4 flex items-center gap-2.5 text-aqua">
              {STACK_ICONS[g.group]}
              <h3 className="font-mono text-sm uppercase tracking-widest">{g.group}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((t) => (
                <span key={t} className="rounded-lg border border-mint/10 bg-deep/60 px-3 py-1.5 text-sm text-ink">{t}</span>
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
    <Section id="experience" eyebrow="Professional experience" title="Where I've worked">
      <ol className="relative ml-3 border-l border-aqua/25">
        {experience.map((e) => (
          <li key={e.role + e.org} className="reveal relative mb-8 pl-8 last:mb-0">
            <span className="absolute -left-[7px] top-7 h-3.5 w-3.5 rounded-full border-2 border-aqua bg-deep" />
            <div className="glass glass-hover p-6 sm:p-7">
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
            Don't take my word for it. <span className="text-aqua">Watch it run.</span>
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
    <Section id="projects" eyebrow="Featured work" title={<>Systems I've <span className="text-aqua">shipped.</span></>}>
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
    <Section id="leadership" eyebrow="Leadership & achievements" title="Leading beyond the code">
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
    <section className="relative overflow-hidden py-24 md:py-32" aria-label="What I build">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua/10 blur-[110px]" />
      <h2 className="relative flex flex-wrap items-center justify-center gap-x-5 gap-y-4 px-4 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
        I build
        <span className="inline-grid min-w-[7ch] place-items-center rounded-full border border-aqua/40 bg-dark/80 px-8 py-3 shadow-[0_0_60px_-15px] shadow-aqua/60 sm:px-10 sm:py-4">
          <span key={i} className="word-in whitespace-nowrap text-mint">{pitch.buildWords[i]}</span>
        </span>
      </h2>
    </section>
  )
}

/* ───────────── Contact: prompt + orbit + Let's talk ───────────── */
function Contact() {
  const [idea, setIdea] = useState('')
  const send = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent('Project inquiry from your portfolio')
    const body = encodeURIComponent(idea ? `Hi Jethro,\n\nI'd like to build: ${idea}\n\n` : 'Hi Jethro,\n\n')
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }
  const orbiters = [
    { icon: <Code2 size={18} />, pos: 'left-[6%] top-[38%]' },
    { icon: <Brain size={18} />, pos: 'left-[22%] top-[6%]' },
    { icon: <BarChart3 size={18} />, pos: 'right-[20%] top-[4%]' },
    { icon: <Smartphone size={18} />, pos: 'right-[4%] top-[42%]' },
    { icon: <Palette size={18} />, pos: 'right-[18%] bottom-[4%]' },
    { icon: <Database size={18} />, pos: 'left-[20%] bottom-[6%]' },
  ]
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <form onSubmit={send} className="reveal mx-auto flex max-w-xl items-center gap-2 rounded-full border border-mint/20 bg-ink p-2 pl-6 shadow-2xl shadow-aqua/10">
        <label htmlFor="idea" className="sr-only">What do you want to build?</label>
        <input
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Have something to build?"
          className="min-w-0 flex-1 bg-transparent font-display text-lg font-medium text-deep placeholder:text-deep/70 focus:outline-none sm:text-xl"
        />
        <button type="submit" aria-label="Send project idea" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-aqua text-deep transition hover:bg-dark hover:text-mint">
          <ArrowRight size={20} />
        </button>
      </form>

      <div className="reveal relative mx-auto mt-20 aspect-square w-full max-w-[420px]" aria-hidden="true">
        <div className="absolute inset-[12%] rounded-full border border-aqua/20" />
        <div className="absolute inset-[26%] rounded-full border border-dashed border-aqua/25" />
        <div className="absolute inset-[34%] rounded-full bg-aqua/20 blur-2xl" />
        <div className="animate-float absolute inset-[36%] grid place-items-center rounded-full border-2 border-aqua/60 bg-dark">
          <span className="font-display text-4xl font-bold text-aqua">J<span className="text-mint">M</span></span>
        </div>
        {orbiters.map((o, n) => (
          <span key={n} className={`glass animate-float absolute grid h-12 w-12 place-items-center !rounded-2xl text-mint ${o.pos}`} style={{ animationDelay: `${n * 0.7}s` }}>
            {o.icon}
          </span>
        ))}
      </div>
      <p className="reveal mt-6 text-center text-lg text-muted">{pitch.availability}</p>

      <div className="reveal mt-14 flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="font-display text-2xl font-semibold text-white">Jethro Mandalones</span>
        </div>
        <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-3 rounded-full bg-aqua py-2.5 pl-8 pr-2.5 font-display text-xl font-semibold text-deep transition hover:bg-mint">
          Let's talk
          <span className="grid h-10 w-10 place-items-center rounded-full bg-deep text-aqua transition group-hover:translate-x-1"><ArrowRight size={18} /></span>
        </a>
        <div className="flex gap-3">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-xl border border-mint/15 text-muted hover:border-aqua/60 hover:text-mint"><GithubIcon /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-xl border border-mint/15 text-muted hover:border-aqua/60 hover:text-mint"><LinkedinIcon /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="grid h-11 w-11 place-items-center rounded-xl border border-mint/15 text-muted hover:border-aqua/60 hover:text-mint"><Mail size={18} /></a>
          <a href={profile.resume} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-mint/15 px-4 text-sm text-muted hover:border-aqua/60 hover:text-mint"><FileText size={16} /> View CV</a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Qualifications />
        <Stack />
        <Experience />
        <Demos />
        <Projects />
        <Leadership />
        <BuildBand />
        <Contact />
      </main>
      <footer className="border-t border-mint/10 py-8 text-center font-mono text-xs text-muted">
        © {new Date().getFullYear()} {profile.name} · San Pablo City, Laguna
      </footer>
    </>
  )
}

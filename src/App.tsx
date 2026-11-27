import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowDown, ArrowRight, Award, BarChart3, Brain, Briefcase, Code2, Database,
  FileText, GraduationCap, Layout, Mail, MapPin, Menu, Server, Smartphone,
  Sparkles, Users, Wrench, X,
} from 'lucide-react'
import {
  about, education, experience, leadership, leadershipSummary, profile,
  projects, qualifications, techStack,
} from './data'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'qualifications', label: 'Qualifications' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'contact', label: 'Contact' },
]

const STACK_ICONS: Record<string, ReactNode> = {
  Backend: <Server size={18} />,
  Frontend: <Layout size={18} />,
  Database: <Database size={18} />,
  'AI Integration': <Brain size={18} />,
  Mobile: <Smartphone size={18} />,
  Tools: <Wrench size={18} />,
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

function useRotatingWord(words: string[], ms = 2600) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), ms)
    return () => clearInterval(t)
  }, [words.length, ms])
  return i
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="reveal mb-12">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
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
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-aqua/50 bg-dark font-display text-sm font-bold text-aqua">
            J<span className="text-mint">M</span>
          </span>
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
          <a href="#contact" className="hidden rounded-lg border border-aqua/60 px-4 py-2 text-sm text-mint transition hover:bg-aqua/10 sm:inline-block">Let's talk</a>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-lg text-mint lg:hidden" aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="glass mx-3 mt-2 flex flex-col p-2 lg:hidden">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-muted hover:bg-aqua/10 hover:text-mint">{n.label}</a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

function OrbitArt() {
  // Concentric teal rings with orbiting nodes: a quiet, technical hero visual
  const rings = [70, 105, 140, 175]
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]" aria-hidden="true">
      <div className="absolute inset-[18%] rounded-full bg-aqua/25 blur-3xl" />
      <svg viewBox="-200 -200 400 400" className="animate-spin-slow absolute inset-0 h-full w-full">
        {rings.map((r, i) => (
          <g key={r}>
            <circle r={r} fill="none" stroke="#12B8A6" strokeOpacity={0.14 + i * 0.06} strokeDasharray={i % 2 ? '2 6' : undefined} />
            <circle cx={r * Math.cos(i * 1.7)} cy={r * Math.sin(i * 1.7)} r={i === 3 ? 5 : 3.5} fill={i % 2 ? '#8BE5D5' : '#12B8A6'} />
          </g>
        ))}
        <ellipse rx="175" ry="60" fill="none" stroke="#8BE5D5" strokeOpacity=".18" transform="rotate(-25)" />
        <ellipse rx="175" ry="60" fill="none" stroke="#12B8A6" strokeOpacity=".18" transform="rotate(35)" />
      </svg>
      <div className="animate-float absolute inset-[30%] grid place-items-center rounded-full border border-aqua/40 bg-dark/80 backdrop-blur">
        <span className="font-display text-5xl font-bold text-aqua sm:text-6xl">J<span className="text-mint">M</span></span>
      </div>
      {['React', 'Laravel', 'OpenAI', 'Flutter'].map((t, i) => (
        <span
          key={t}
          className="glass absolute !rounded-full px-3 py-1.5 font-mono text-xs text-mint"
          style={[{ top: '6%', left: '8%' }, { top: '18%', right: '0%' }, { bottom: '14%', left: '0%' }, { bottom: '4%', right: '10%' }][i]}
        >
          {t}
        </span>
      ))}
    </div>
  )
}

function Hero() {
  const i = useRotatingWord(profile.roles)
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-aqua/10 blur-[120px]" />
      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 md:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="eyebrow mb-5 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-aqua" /> Open to opportunities
          </p>
          <p className="mb-3 font-mono text-sm tracking-widest text-muted">HI, I'M {profile.name.toUpperCase()}</p>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Aspiring
            <span className="relative block h-[1.15em] overflow-hidden">
              {profile.roles.map((r, n) => (
                <span
                  key={r}
                  className="absolute left-0 top-0 whitespace-nowrap bg-gradient-to-r from-aqua to-mint bg-clip-text text-transparent transition-all duration-700"
                  style={{ transform: `translateY(${(n - i) * 100}%)`, opacity: n === i ? 1 : 0 }}
                >
                  {r}
                </span>
              ))}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{profile.tagline}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted"><MapPin size={16} className="text-aqua" /> {profile.location}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="group inline-flex items-center gap-2 rounded-xl bg-aqua px-5 py-3 font-medium text-deep transition hover:bg-mint">
              View my work <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a href={profile.resume} className="inline-flex items-center gap-2 rounded-xl border border-mint/25 bg-dark/60 px-5 py-3 font-medium text-ink transition hover:border-aqua/60">
              <FileText size={18} /> Resume
            </a>
          </div>
          <div className="mt-8 flex gap-3">
            {[
              { href: profile.github, label: 'GitHub', icon: <GithubIcon /> },
              { href: profile.linkedin, label: 'LinkedIn', icon: <LinkedinIcon /> },
              { href: `mailto:${profile.email}`, label: 'Email', icon: <Mail size={18} /> },
            ].map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="grid h-11 w-11 place-items-center rounded-xl border border-mint/15 text-muted transition hover:border-aqua/60 hover:text-mint">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <OrbitArt />
      </div>
      <a href="#about" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted md:flex" aria-label="Scroll to About">
        <span className="h-10 w-px bg-gradient-to-b from-transparent to-aqua" />
        <ArrowDown size={16} className="animate-bounce text-aqua" />
      </a>
    </section>
  )
}

function About() {
  return (
    <Section id="about" eyebrow="01 · About me" title="Where code meets business">
      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="reveal glass p-7 sm:p-9">
          {about.paragraphs.map((p) => <p key={p} className="mb-4 leading-relaxed text-muted last:mb-0">{p}</p>)}
          <div className="mt-6 flex flex-wrap gap-2">
            {about.focus.map((f) => <span key={f} className="chip">{f}</span>)}
          </div>
        </div>
        <div className="grid gap-6">
          <div className="reveal glass p-7">
            <div className="mb-4 flex items-center gap-3 text-aqua"><GraduationCap size={22} /><span className="eyebrow !text-aqua">Education</span></div>
            <h3 className="font-display text-xl font-semibold text-white">{education.degree}</h3>
            <p className="text-mint">{education.major}</p>
            <p className="mt-2 text-sm text-muted">{education.school}</p>
            <p className="mt-1 font-mono text-xs text-muted">{education.years}</p>
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
    <Section id="qualifications" eyebrow="02 · Qualifications" title="What I bring to a team">
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

function Stack() {
  return (
    <Section id="stack" eyebrow="03 · Tech stack" title="Tools I build with">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </Section>
  )
}

function Projects() {
  return (
    <Section id="projects" eyebrow="04 · Featured projects" title="Systems I've built">
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <article key={p.title} className={`reveal glass glass-hover relative flex flex-col overflow-hidden p-7 ${p.featured ? 'md:min-h-[300px]' : ''}`}>
            {p.featured && <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-aqua/15 blur-3xl" />}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {p.featured && <span className="chip !text-deep !bg-aqua !border-aqua">Featured</span>}
              {p.badge && <span className="chip inline-flex items-center gap-1"><Award size={12} /> {p.badge}</span>}
            </div>
            <h3 className="font-display text-2xl font-semibold text-white">{p.title}</h3>
            <p className="mt-1 text-mint">{p.kind}</p>
            <p className="mt-4 flex-1 leading-relaxed text-muted">{p.description}</p>
            <p className="mt-5 flex items-center gap-2 font-mono text-xs text-muted"><Briefcase size={14} className="text-aqua" /> {p.role}</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-mint/10 pt-4">
              {p.tech.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

function Experience() {
  return (
    <Section id="experience" eyebrow="05 · Experience" title="Where I've worked">
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
              <ul className="mt-4 space-y-2">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />{pt}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Leadership() {
  const top = leadership.find((l) => l.highlight)!
  const rest = leadership.filter((l) => !l.highlight)
  return (
    <Section id="leadership" eyebrow="06 · Leadership & achievements" title="Leading beyond the code">
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

function Contact() {
  return (
    <Section id="contact" eyebrow="07 · Contact" title="Let's build something together">
      <div className="reveal glass relative overflow-hidden p-8 text-center sm:p-14">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <Sparkles className="mx-auto mb-5 text-aqua" size={30} />
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">
            I'm open to junior software engineering and full-stack roles, internships and freelance projects, especially work that mixes development, data and AI.
          </p>
          <a href={`mailto:${profile.email}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-aqua px-6 py-3.5 font-medium text-deep transition hover:bg-mint">
            <Mail size={18} /> Say hello
          </a>
          <div className="mt-8 flex justify-center gap-3">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-xl border border-mint/15 text-muted hover:border-aqua/60 hover:text-mint"><GithubIcon /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-xl border border-mint/15 text-muted hover:border-aqua/60 hover:text-mint"><LinkedinIcon /></a>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Qualifications />
        <Stack />
        <Projects />
        <Experience />
        <Leadership />
        <Contact />
      </main>
      <footer className="border-t border-mint/10 py-8 text-center font-mono text-xs text-muted">
        © {new Date().getFullYear()} {profile.name} · Built with React, Tailwind & a lot of teal.
      </footer>
    </>
  )
}

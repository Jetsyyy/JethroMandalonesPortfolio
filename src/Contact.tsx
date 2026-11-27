import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowUpRight, Check, Mail, MessageCircle, MessagesSquare, Send, Sparkles } from 'lucide-react'
import { profile } from './data'
import { siGithub } from './brandIcons'

const LINKEDIN = 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z'
const FACEBOOK = 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'
const Svg = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden><path d={d} /></svg>

const KINDS = ['Web app', 'Website', 'AI integration', 'Mobile app', 'Dashboard', 'Graphics / video']

const NEXT = [
  { t: 'You send a brief', d: 'A few lines about the project and when you need it is plenty.' },
  { t: 'I reply within a day', d: 'With questions, or a time for a short call if it’s easier to talk.' },
  { t: 'We scope it together', d: 'What it must do, what can wait, and what matters most to you.' },
  { t: 'You get a plan', d: 'Timeline, stack and a clear quote, then I start building.' },
]

/** Live San Pablo time + whether I'm likely around. */
function useLocalTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  const time = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit' }).format(now)
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', hourCycle: 'h23' }).format(now))
  const around = hour >= 8 && hour < 22
  return { time, around }
}

export default function Contact() {
  const { time, around } = useLocalTime()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [kinds, setKinds] = useState<string[]>([])
  const [own, setOwn] = useState('')
  const [more, setMore] = useState('')
  const [sent, setSent] = useState<null | 'email' | 'whatsapp'>(null)

  const toggle = (k: string) => setKinds((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]))

  const brief = useMemo(() => {
    const what = [...kinds, own.trim()].filter(Boolean).join(', ') || 'not sure yet'
    return [
      'Hi Jethro,',
      '',
      `I'm ${name.trim() || '(name)'}${email.trim() ? ` (${email.trim()})` : ''}.`,
      `What I'm building: ${what}`,
      '',
      more.trim() || '(details)',
    ].join('\n')
  }, [name, email, kinds, own, more])

  const viaEmail = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Project brief${kinds.length ? ` · ${kinds.join(', ')}` : ''}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(brief)}`
    setSent('email')
  }
  const viaWhatsApp = () => {
    window.open(`${profile.whatsapp}?text=${encodeURIComponent(brief)}`, '_blank', 'noopener')
    setSent('whatsapp')
  }

  const LINKS = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: <Mail size={18} /> },
    { label: 'WhatsApp', value: profile.phoneDisplay, href: profile.whatsapp, icon: <MessageCircle size={18} /> },
    { label: 'LinkedIn', value: 'linkedin.com/in/jethromandalones', href: profile.linkedin, icon: <Svg d={LINKEDIN} /> },
    { label: 'GitHub', value: 'github.com/Jetsyyy', href: profile.github, icon: <Svg d={siGithub.path} /> },
    { label: 'Facebook', value: 'facebook.com/jethjeth.mandalones', href: profile.facebook, icon: <Svg d={FACEBOOK} /> },
  ]

  const field = 'w-full rounded-2xl border border-mint/10 bg-space/60 px-4 py-3.5 text-ink placeholder:text-muted/60 outline-none transition focus:border-lime/50 focus:bg-space/80 focus:shadow-[0_0_0_4px_rgba(214,247,255,.06),0_0_24px_-8px_rgba(168,232,244,.5)]'
  const label = 'mb-2 flex items-baseline gap-2 text-sm font-medium text-white'
  const num = 'font-mono text-[11px] text-aqua'

  return (
    <section id="contact" className="relative overflow-hidden pb-28 pt-24 md:pt-32">
      {/* floating glass icons */}
      <div aria-hidden className="pointer-events-none absolute left-[4%] top-16 hidden md:block">
        <div className="animate-float grid h-28 w-28 rotate-[-10deg] place-items-center rounded-[30px] border border-mint/15 bg-gradient-to-br from-aqua/30 to-dark/60 text-lime shadow-[0_30px_60px_-20px_rgba(60,196,220,.45)] backdrop-blur-xl">
          <MessagesSquare size={44} />
        </div>
        <div className="animate-float absolute -bottom-6 -right-8 grid h-14 w-14 place-items-center rounded-full border border-mint/20 bg-cyan/40 text-white shadow-[0_0_30px_-4px_rgba(76,155,196,.8)] backdrop-blur" style={{ animationDelay: '1.4s' }}>
          <Sparkles size={22} />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute right-[5%] top-24 hidden md:block">
        <div className="animate-float grid h-24 w-24 rotate-[12deg] place-items-center rounded-[28px] border border-mint/15 bg-gradient-to-br from-mint/25 to-dark/60 text-white shadow-[0_30px_60px_-20px_rgba(168,232,244,.4)] backdrop-blur-xl" style={{ animationDelay: '.7s' }}>
          <Send size={38} />
        </div>
      </div>

      {/* heading */}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="eyebrow mb-5 inline-flex items-center gap-3"><span className="h-px w-8 bg-gradient-to-r from-lime to-emerald" />Contact</p>
        <h2 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl">
          Let’s talk about <span className="accent">your idea.</span>
        </h2>
        <p className="mt-5 text-lg text-muted">
          Use the brief below, or email <a href={`mailto:${profile.email}`} className="inline-block text-mint underline decoration-mint/30 underline-offset-4 hover:text-lime">{profile.email}</a> directly.
        </p>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* ── project brief ── */}
        <form onSubmit={viaEmail} className="glass spotlight relative min-w-0 !rounded-[28px] p-6 sm:p-9">
          <h3 className="font-display text-3xl font-semibold text-white">Project brief</h3>
          <p className="mt-1 text-sm text-muted">Takes a minute. It opens your email or WhatsApp with everything filled in.</p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={label}><span className={num}>01</span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} autoComplete="name" />
            </label>
            <label className="block">
              <span className={label}><span className={num}>02</span>Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.com" className={field} autoComplete="email" />
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className={label}><span className={num}>03</span>What are you building?</legend>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => {
                const on = kinds.includes(k)
                return (
                  <button key={k} type="button" onClick={() => toggle(k)} aria-pressed={on}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition duration-300 ${on
                      ? 'border-lime/60 bg-lime/15 text-white shadow-[0_0_20px_-6px_rgba(214,247,255,.7)]'
                      : 'border-mint/15 text-muted hover:border-mint/40 hover:text-white'}`}>
                    {on && <Check size={14} className="text-lime" />}{k}
                  </button>
                )
              })}
            </div>
            <input value={own} onChange={(e) => setOwn(e.target.value)} placeholder="Or say it in your own words" className={`${field} mt-3`} />
          </fieldset>

          <label className="mt-6 block">
            <span className={label}><span className={num}>04</span>Tell me more</span>
            <textarea value={more} onChange={(e) => setMore(e.target.value)} rows={5} placeholder="What are you building, and when do you need it?" className={`${field} resize-y`} />
          </label>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-shine group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-lime px-6 py-3.5 font-semibold text-space shadow-[0_0_30px_-8px_rgba(214,247,255,.9)] transition hover:bg-mint">
              Send via email <Send size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button type="button" onClick={viaWhatsApp} className="inline-flex items-center gap-2 rounded-full border border-mint/25 px-6 py-3.5 font-medium text-ink transition hover:border-lime hover:text-white hover:shadow-[0_0_24px_-8px_rgba(168,232,244,.7)]">
              <MessageCircle size={17} /> Send via WhatsApp
            </button>
          </div>
          {sent && (
            <p role="status" className="panel-in mt-4 flex items-center gap-2 text-sm text-mint">
              <Check size={15} className="text-lime" /> {sent === 'email' ? 'Your email app should be open with the brief ready to send.' : 'WhatsApp opened in a new tab with your brief.'}
            </p>
          )}
        </form>

        {/* ── work with me ── */}
        <div className="min-w-0">
          <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.25em] text-aqua">
            <span>05</span><span className="text-white">Work with me</span><span className="h-px flex-1 bg-mint/15" />
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-2 text-sm text-white">
            <span className="relative grid h-2.5 w-2.5 place-items-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-lime/60" />
              <span className="h-2 w-2 rounded-full bg-lime" />
            </span>
            Available for freelance work
          </span>
          <p className="mt-3 text-sm text-muted">
            It’s <span className="font-semibold text-white">{time}</span> in San Pablo City. {around ? 'I’m around; expect a reply today.' : 'I’m offline for now; expect a reply tomorrow morning.'}
          </p>

          <ul className="mt-7 divide-y divide-mint/10 border-y border-mint/10">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="group flex items-center gap-4 py-4 transition">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-mint/15 text-muted transition group-hover:border-lime/50 group-hover:text-lime group-hover:shadow-[0_0_20px_-6px_rgba(214,247,255,.8)]">{l.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[.2em] text-muted">{l.label}</span>
                    <span className="block truncate font-display text-lg text-white transition group-hover:[text-shadow:0_0_14px_rgba(168,232,244,.7)]">{l.value}</span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime" />
                </a>
              </li>
            ))}
          </ul>

          <p className="mb-5 mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.25em] text-aqua">
            <span>06</span><span className="text-white">What happens next</span><span className="h-px flex-1 bg-mint/15" />
          </p>
          <ol className="relative space-y-6 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-gradient-to-b before:from-lime/70 before:via-aqua/40 before:to-transparent">
            {NEXT.map((s, i) => (
              <li key={s.t} className="group relative flex gap-4">
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-lime/40 bg-space font-mono text-xs text-lime shadow-[0_0_18px_-4px_rgba(214,247,255,.6)] transition group-hover:bg-lime group-hover:text-space">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="pt-1.5">
                  <span className="block font-display text-lg font-semibold text-white">{s.t}</span>
                  <span className="mt-0.5 block text-sm text-muted">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

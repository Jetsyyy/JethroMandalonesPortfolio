import type { CSSProperties, ReactNode } from 'react'
import {
  siCanva, siCss3, siDart, siFigma, siFirebase, siFlutter, siGit, siGithub, siGoogle, siHtml5,
  siJavascript, siLaravel, siMysql, siNextdotjs, siNodedotjs, siNotion, siOpenai, siPhp, siPostgresql,
  siPostman, siReact, siRender, siSupabase, siTailwindcss, siTrello, siVercel,
} from './brandIcons'
import { AudioLines, Bot, Cloud, Code2, Scissors, Sparkles, TrendingUp, Waves } from 'lucide-react'

type Brand = { hex: string; path?: string; icon?: ReactNode }

// Official brand marks + colours (simple-icons); lucide symbols for brands it doesn't ship.
const BRANDS: Record<string, Brand> = {
  PHP: siPhp, JavaScript: siJavascript, HTML5: siHtml5, CSS3: siCss3, SQL: siMysql, Dart: siDart,
  Laravel: siLaravel, 'React.js': siReact, React: siReact, 'Next.js': siNextdotjs, 'Node.js': siNodedotjs,
  'Tailwind CSS': siTailwindcss, Flutter: siFlutter, Blade: siLaravel,
  MySQL: siMysql, PostgreSQL: siPostgresql, Firebase: siFirebase, Supabase: siSupabase,
  'OpenAI API': siOpenai, Git: siGit, GitHub: siGithub, Vercel: siVercel, Render: siRender, Postman: siPostman,
  Figma: siFigma, Canva: siCanva, Notion: siNotion, Trello: siTrello, 'Google Workspace': siGoogle,
  Riverpod: { hex: '00B4AB', icon: <Waves /> },
  'Azure AI': { hex: '0078D4', icon: <Cloud /> },
  'Retell AI (Voice AI)': { hex: '2DD4BF', icon: <AudioLines /> },
  'Retell AI': { hex: '2DD4BF', icon: <AudioLines /> },
  'VS Code': { hex: '007ACC', icon: <Code2 /> },
  'CapCut Pro': { hex: 'FFFFFF', icon: <Scissors /> },
  CapCut: { hex: 'FFFFFF', icon: <Scissors /> },
  'AI Integration': { hex: 'FFB454', icon: <Sparkles /> },
  'AI-powered apps': { hex: '38BDF8', icon: <Bot /> },
  'Predictive Analytics': { hex: 'F5C451', icon: <TrendingUp /> },
}

// Keep each brand's hue but make sure it reads on the dark background (black logos → white).
function readable(hex: string) {
  let r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16)
  const lum = (x: number, y: number, z: number) => (0.2126 * x + 0.7152 * y + 0.0722 * z) / 255
  if (lum(r, g, b) < 0.08) return '#F2F7F9'
  // OpenAI's brand purple is near-black; show it white like its dark-mode mark
  if (hex === '412991') return '#F2F7F9'
  for (let i = 0; i < 8 && lum(r, g, b) < 0.42; i++) {
    r += (255 - r) * 0.18; g += (255 - g) * 0.18; b += (255 - b) * 0.18
  }
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

export function brandColor(name: string) {
  const b = BRANDS[name]
  return b ? readable(b.hex) : '#A8E8F4'
}

export function BrandIcon({ name, size = 15 }: { name: string; size?: number }) {
  const b = BRANDS[name]
  const color = brandColor(name)
  if (b?.path) {
    return (
      <svg role="img" aria-hidden viewBox="0 0 24 24" width={size} height={size} fill={color} className="shrink-0">
        <path d={b.path} />
      </svg>
    )
  }
  return (
    <span aria-hidden className="grid shrink-0 place-items-center [&>svg]:h-full [&>svg]:w-full" style={{ width: size, height: size, color }}>
      {b?.icon ?? <Sparkles />}
    </span>
  )
}

/** A skill chip tinted in the tool's real brand colour. */
export default function SkillPill({ name, size = 'md', className = '' }: { name: string; size?: 'md' | 'lg'; className?: string }) {
  const c = brandColor(name)
  const style = {
    '--brand': c,
    background: `color-mix(in oklab, ${c} 11%, rgba(4,20,28,.75))`,
    borderColor: `color-mix(in oklab, ${c} 38%, transparent)`,
  } as CSSProperties
  return (
    <span style={style}
      className={`group/pill inline-flex items-center gap-2 whitespace-nowrap rounded-full border text-ink transition duration-300 hover:-translate-y-0.5 hover:[box-shadow:0_8px_24px_-8px_var(--brand)] hover:[border-color:var(--brand)] ${size === 'lg' ? 'px-5 py-2.5 text-sm' : 'px-3 py-1.5 text-sm'} ${className}`}>
      <BrandIcon name={name} size={size === 'lg' ? 17 : 15} />
      {name}
    </span>
  )
}

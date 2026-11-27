import { useId } from 'react'

/**
 * Flowing light ribbons (lime → emerald → cyan) with travelling comets of light.
 * Purely decorative; position it absolutely behind content.
 */
const PATHS = [
  'M-100 520 C 260 520, 420 260, 760 300 S 1260 120, 1560 60',
  'M-100 560 C 300 540, 480 320, 800 340 S 1280 180, 1560 120',
  'M-100 600 C 320 580, 520 380, 840 380 S 1300 240, 1560 190',
  'M-100 470 C 240 480, 400 220, 720 250 S 1220 60, 1560 0',
  'M-100 640 C 360 620, 560 430, 880 420 S 1320 300, 1560 260',
]

export default function LightStreaks({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg className={`pointer-events-none ${className}`} viewBox="0 0 1440 700" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={`g${uid}`} x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#C6F432" stopOpacity="0" />
          <stop offset=".25" stopColor="#C6F432" />
          <stop offset=".55" stopColor="#2EE59D" />
          <stop offset=".85" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
        <filter id={`b${uid}`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      {/* soft glow body */}
      <g filter={`url(#b${uid})`} opacity=".55">
        {PATHS.map((d, i) => <path key={i} d={d} fill="none" stroke={`url(#g${uid})`} strokeWidth={i === 1 ? 14 : 6} />)}
      </g>
      {/* fine bright threads */}
      <g opacity=".7">
        {PATHS.map((d, i) => <path key={i} d={d} fill="none" stroke={`url(#g${uid})`} strokeWidth={i === 1 ? 1.6 : 0.8} />)}
      </g>
      {/* comets travelling along the threads */}
      <g>
        {PATHS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#F3FFD6" strokeWidth={i === 1 ? 3 : 2} strokeLinecap="round"
            strokeDasharray="90 1310" className="streak-flow" style={{ ['--dur' as string]: `${5 + i * 1.3}s`, animationDelay: `${-i * 1.7}s` }} />
        ))}
      </g>
    </svg>
  )
}

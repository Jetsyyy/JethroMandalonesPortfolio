/**
 * "How a project flows" node graph: brief → analysis/design → build → AI/data → ship,
 * with pulses of light travelling along each connection.
 */
type Node = { id: string; x: number; y: number; step: string; title: string; sub: string }

const NODES: Node[] = [
  { id: 'brief', x: 95, y: 170, step: '01', title: 'Your brief', sub: 'idea · goals' },
  { id: 'plan', x: 305, y: 70, step: '02', title: 'Analyze', sub: 'requirements' },
  { id: 'design', x: 305, y: 270, step: '03', title: 'Design', sub: 'Figma prototype' },
  { id: 'ai', x: 695, y: 70, step: '05', title: 'Integrate AI', sub: 'OpenAI · Retell' },
  { id: 'data', x: 695, y: 270, step: '06', title: 'Analytics', sub: 'dashboards' },
  { id: 'ship', x: 905, y: 170, step: '07', title: 'Ship', sub: 'deployed · live' },
]
const CENTER = { x: 500, y: 170, r: 50 }
const HALF = 78 // half node width

const at = (id: string) => NODES.find((n) => n.id === id)!
const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2
  return `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

const LINKS = [
  curve(at('brief').x + HALF, at('brief').y, at('plan').x - HALF, at('plan').y),
  curve(at('brief').x + HALF, at('brief').y, at('design').x - HALF, at('design').y),
  curve(at('plan').x + HALF, at('plan').y, CENTER.x - CENTER.r, CENTER.y),
  curve(at('design').x + HALF, at('design').y, CENTER.x - CENTER.r, CENTER.y),
  curve(CENTER.x + CENTER.r, CENTER.y, at('ai').x - HALF, at('ai').y),
  curve(CENTER.x + CENTER.r, CENTER.y, at('data').x - HALF, at('data').y),
  curve(at('ai').x + HALF, at('ai').y, at('ship').x - HALF, at('ship').y),
  curve(at('data').x + HALF, at('data').y, at('ship').x - HALF, at('ship').y),
]

export default function FlowDiagram() {
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 1000 340" className="block h-auto w-full min-w-[680px]" role="img"
        aria-label="Project flow: your brief, then analysis and design, then build, then AI integration and analytics, then ship.">
        <defs>
          <linearGradient id="flow-line" x1="0" x2="1">
            <stop offset="0" stopColor="#3CC4DC" stopOpacity=".5" />
            <stop offset=".5" stopColor="#6FD6EA" stopOpacity=".8" />
            <stop offset="1" stopColor="#D6F7FF" stopOpacity=".6" />
          </linearGradient>
          <radialGradient id="flow-core">
            <stop offset="0" stopColor="#F2FDFF" />
            <stop offset=".45" stopColor="#D6F7FF" />
            <stop offset="1" stopColor="#6FD6EA" />
          </radialGradient>
          <filter id="flow-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {LINKS.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="url(#flow-line)" strokeWidth="1.4" strokeDasharray="4 5" />
            <circle r="3.6" fill="#F2FDFF">
              <animateMotion dur={`${2.2 + (i % 3) * 0.35}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite" path={d} />
            </circle>
            <circle r="9" fill="#6FD6EA" opacity=".25">
              <animateMotion dur={`${2.2 + (i % 3) * 0.35}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        ))}

        {NODES.map((n) => (
          <g key={n.id} transform={`translate(${n.x - HALF} ${n.y - 34})`}>
            <rect width={HALF * 2} height="68" rx="16" fill="#081D27" stroke="#A8E8F4" strokeOpacity=".18" />
            <rect x="12" y="14" width="26" height="18" rx="5" fill="#3CC4DC" fillOpacity=".14" />
            <text x="25" y="27" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#6FD6EA">{n.step}</text>
            <text x="46" y="28" fontFamily="Space Grotesk, sans-serif" fontSize="15" fontWeight="600" fill="#E6F3F7">{n.title}</text>
            <text x="14" y="52" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fill="#8AA8B4">{n.sub}</text>
          </g>
        ))}

        {/* glowing core: the build step */}
        <circle cx={CENTER.x} cy={CENTER.y} r={CENTER.r + 6} fill="#D6F7FF" opacity=".35" filter="url(#flow-glow)">
          <animate attributeName="opacity" values=".25;.55;.25" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={CENTER.x} cy={CENTER.y} r={CENTER.r + 14} fill="none" stroke="#D6F7FF" strokeOpacity=".25">
          <animate attributeName="r" values={`${CENTER.r + 6};${CENTER.r + 22};${CENTER.r + 6}`} dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values=".4;0;.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <rect x={CENTER.x - CENTER.r} y={CENTER.y - CENTER.r} width={CENTER.r * 2} height={CENTER.r * 2} rx="26" fill="url(#flow-core)" />
        <text x={CENTER.x} y={CENTER.y - 4} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#062430">04</text>
        <text x={CENTER.x} y={CENTER.y + 15} textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="17" fontWeight="700" fill="#062430">Build</text>
      </svg>
    </div>
  )
}

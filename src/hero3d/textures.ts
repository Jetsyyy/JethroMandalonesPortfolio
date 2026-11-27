import * as THREE from 'three'

const DEEP = '#071B1B'
const DARK = '#0B3030'
const AQUA = '#12B8A6'
const MINT = '#8BE5D5'

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

function toTexture(c: HTMLCanvasElement, anisotropy = 8) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = anisotropy
  return t
}

/** Self-healing cutting mat: dark teal with an aqua measuring grid and ruler marks. */
export function matTexture() {
  const W = 2048, H = 1366
  const [c, g] = canvas(W, H)
  g.fillStyle = DARK
  g.fillRect(0, 0, W, H)
  // faint mottling so it doesn't look flat/CG
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(139,229,213,${Math.random() * 0.025})`
    g.fillRect(Math.random() * W, Math.random() * H, 2 + Math.random() * 3, 2 + Math.random() * 3)
  }
  const m = 90, cell = (W - m * 2) / 40
  for (let i = 0; i <= 40; i++) {
    const x = m + i * cell
    g.strokeStyle = i % 5 === 0 ? 'rgba(18,184,166,.55)' : 'rgba(18,184,166,.18)'
    g.lineWidth = i % 5 === 0 ? 2.2 : 1.2
    g.beginPath(); g.moveTo(x, m); g.lineTo(x, H - m); g.stroke()
  }
  const rows = Math.round((H - m * 2) / cell)
  for (let j = 0; j <= rows; j++) {
    const y = m + j * cell
    g.strokeStyle = j % 5 === 0 ? 'rgba(18,184,166,.55)' : 'rgba(18,184,166,.18)'
    g.lineWidth = j % 5 === 0 ? 2.2 : 1.2
    g.beginPath(); g.moveTo(m, y); g.lineTo(W - m, y); g.stroke()
  }
  // diagonal guides like a real mat
  g.strokeStyle = 'rgba(139,229,213,.12)'
  g.lineWidth = 1.5
  g.beginPath(); g.moveTo(m, H - m); g.lineTo(m + (H - m * 2), m); g.stroke()
  g.beginPath(); g.moveTo(W - m, H - m); g.lineTo(W - m - (H - m * 2), m); g.stroke()
  // ruler numbers
  g.fillStyle = 'rgba(139,229,213,.65)'
  g.font = '500 26px "JetBrains Mono", monospace'
  g.textAlign = 'center'
  for (let i = 0; i <= 40; i += 5) {
    g.fillText(String(i), m + i * cell, m - 22)
    g.fillText(String(i), m + i * cell, H - m + 44)
  }
  g.textAlign = 'left'
  g.font = '600 24px "JetBrains Mono", monospace'
  g.fillStyle = 'rgba(139,229,213,.5)'
  g.fillText('JM · BUILD / MEASURE / SHIP', m, H - 22)
  return toTexture(c, 16)
}

/** Laptop screen: a code editor that "describes" Jethro. Redraws for a blinking cursor. */
export function screenTexture() {
  const W = 1280, H = 820
  const [c, g] = canvas(W, H)
  const lines: [string, string][][] = [
    [['const ', AQUA], ['jethro', '#ffffff'], [' = {', MINT]],
    [['  role', MINT], [': ', '#ffffff'], ["'Full-Stack Developer'", AQUA], [',', '#ffffff']],
    [['  major', MINT], [': ', '#ffffff'], ["'Business Analytics'", AQUA], [',', '#ffffff']],
    [['  stack', MINT], [': [', '#ffffff'], ["'Laravel'", AQUA], [', ', '#ffffff'], ["'React'", AQUA], [', ', '#ffffff'], ["'Flutter'", AQUA], ['],', '#ffffff']],
    [['  ai', MINT], [': [', '#ffffff'], ["'OpenAI'", AQUA], [', ', '#ffffff'], ["'Azure'", AQUA], [', ', '#ffffff'], ["'Retell'", AQUA], ['],', '#ffffff']],
    [['  based', MINT], [': ', '#ffffff'], ["'San Pablo City, PH'", AQUA], [',', '#ffffff']],
    [['  available', MINT], [': ', '#ffffff'], ['true', '#F5C97B']],
    [['}', MINT]],
    [['', '#fff']],
    [['// ', '#4F7C76'], ['tell me what you need', '#4F7C76']],
    [['jethro', '#ffffff'], ['.', MINT], ['build', AQUA], ['(', '#ffffff'], ['yourIdea', '#F5C97B'], [')', '#ffffff']],
  ]
  const tex = toTexture(c)
  const draw = (cursor: boolean) => {
    g.fillStyle = '#041111'
    g.fillRect(0, 0, W, H)
    // title bar
    g.fillStyle = DEEP
    g.fillRect(0, 0, W, 64)
    ;['#2b4f4b', '#2b4f4b', '#2b4f4b'].forEach((col, i) => {
      g.fillStyle = col; g.beginPath(); g.arc(36 + i * 30, 32, 9, 0, Math.PI * 2); g.fill()
    })
    g.fillStyle = 'rgba(139,229,213,.7)'
    g.font = '500 24px "JetBrains Mono", monospace'
    g.fillText('jethro.ts', 150, 41)
    // sidebar
    g.fillStyle = '#061818'
    g.fillRect(0, 64, 64, H - 64)
    g.font = '500 34px "JetBrains Mono", monospace'
    let y = 132
    lines.forEach((parts, i) => {
      g.fillStyle = '#2f5752'
      g.fillText(String(i + 1).padStart(2, ' '), 82, y)
      let x = 150
      parts.forEach(([txt, col]) => { g.fillStyle = col; g.fillText(txt, x, y); x += g.measureText(txt).width })
      if (i === lines.length - 1 && cursor) { g.fillStyle = AQUA; g.fillRect(x + 6, y - 30, 16, 38) }
      y += 56
    })
    // status bar
    g.fillStyle = AQUA
    g.fillRect(0, H - 40, W, 40)
    g.fillStyle = DEEP
    g.font = '600 22px "JetBrains Mono", monospace'
    g.fillText('● ready to ship', 24, H - 13)
    tex.needsUpdate = true
  }
  draw(true)
  return { tex, draw }
}

/** Keyboard deck: rows of keys. */
export function keyboardTexture() {
  const W = 1024, H = 420
  const [c, g] = canvas(W, H)
  g.fillStyle = '#0d1f1f'
  g.fillRect(0, 0, W, H)
  const rows = [14, 14, 13, 12, 9]
  const kw = 62, kh = 62, gap = 9
  rows.forEach((count, r) => {
    const rowW = count * kw + (count - 1) * gap
    let x = (W - rowW) / 2
    for (let k = 0; k < count; k++) {
      const w = r === 4 && k === 4 ? kw * 4 + gap * 3 : kw
      if (r === 4 && k > 4) break
      g.fillStyle = '#081515'
      g.beginPath(); g.roundRect(x, 20 + r * (kh + gap), w, kh, 9); g.fill()
      g.strokeStyle = 'rgba(18,184,166,.18)'; g.lineWidth = 2; g.stroke()
      x += w + gap
    }
  })
  return toTexture(c)
}

/** JM monogram for the puck top. */
export function monogramTexture() {
  const S = 512
  const [c, g] = canvas(S, S)
  g.fillStyle = AQUA
  g.fillRect(0, 0, S, S)
  g.strokeStyle = 'rgba(7,27,27,.35)'
  g.lineWidth = 6
  g.beginPath(); g.arc(S / 2, S / 2, S * 0.4, 0, Math.PI * 2); g.stroke()
  g.fillStyle = DEEP
  g.font = '700 190px "Space Grotesk", sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText('JM', S / 2, S / 2 + 8)
  return toTexture(c)
}

/** Phone screen: a little mobile app UI (nod to Succor Haven). */
export function phoneTexture() {
  const W = 360, H = 720
  const [c, g] = canvas(W, H)
  g.fillStyle = '#041111'
  g.fillRect(0, 0, W, H)
  g.fillStyle = MINT
  g.font = '600 22px "Space Grotesk", sans-serif'
  g.fillText('Good evening 👋', 28, 90)
  g.fillStyle = '#ffffff'
  g.font = '700 34px "Space Grotesk", sans-serif'
  g.fillText("Today's lesson", 28, 136)
  g.fillStyle = DARK
  g.beginPath(); g.roundRect(28, 170, W - 56, 16, 8); g.fill()
  g.fillStyle = AQUA
  g.beginPath(); g.roundRect(28, 170, (W - 56) * 0.66, 16, 8); g.fill()
  ;['Ask your AI tutor', 'Practice set', 'Review notes', 'Progress'].forEach((t, i) => {
    g.fillStyle = DARK
    g.beginPath(); g.roundRect(28, 220 + i * 92, W - 56, 74, 18); g.fill()
    g.fillStyle = i === 0 ? AQUA : 'rgba(139,229,213,.8)'
    g.font = '500 24px "Inter", sans-serif'
    g.fillText(t, 52, 265 + i * 92)
  })
  g.fillStyle = AQUA
  g.beginPath(); g.roundRect(28, H - 100, W - 56, 64, 32); g.fill()
  g.fillStyle = DEEP
  g.font = '700 24px "Inter", sans-serif'
  g.textAlign = 'center'
  g.fillText('Start session', W / 2, H - 60)
  return toTexture(c)
}

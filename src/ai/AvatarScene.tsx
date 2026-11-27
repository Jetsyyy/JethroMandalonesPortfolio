import { useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, Sparkles } from '@react-three/drei'

type Props = { active: boolean; reduced: boolean; poke: MutableRefObject<number>; pointer: MutableRefObject<{ x: number; y: number }> }

const damp = THREE.MathUtils.damp
const HEAD_R = 0.78

/** Point on the head sphere (local), for sticking blush / mouth onto the face. */
function onFace(x: number, y: number, lift = 0.004) {
  const z = Math.sqrt(Math.max(0, HEAD_R * HEAD_R - x * x - y * y)) * 0.95 + lift
  return new THREE.Vector3(x, y, z)
}

/**
 * Barong Tagalog fabric: sheer champagne-peach organza with two cream embroidered
 * panels down the front (lattice + filigree swirls) and small buttons between them.
 * Drawn for a cylinder whose u = 0.5 is the front centre.
 */
function barongTexture() {
  const W = 1024, H = 512
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const g = c.getContext('2d')!
  // organza base with soft vertical sheen
  const base = g.createLinearGradient(0, 0, W, 0)
  base.addColorStop(0, '#c9a184'); base.addColorStop(0.25, '#d9b496'); base.addColorStop(0.5, '#e2c0a4')
  base.addColorStop(0.75, '#d9b496'); base.addColorStop(1, '#c9a184')
  g.fillStyle = base; g.fillRect(0, 0, W, H)
  for (let x = 0; x < W; x += 7) { g.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.05})`; g.fillRect(x, 0, 2, H) }

  const cx = W / 2
  const panel = (x0: number) => {
    // lattice band
    g.strokeStyle = 'rgba(255,250,240,.85)'; g.lineWidth = 2
    for (let y = 0; y < H; y += 14) {
      g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + 34, y + 14); g.stroke()
      g.beginPath(); g.moveTo(x0 + 34, y); g.lineTo(x0, y + 14); g.stroke()
    }
    g.strokeStyle = 'rgba(255,250,240,.95)'; g.lineWidth = 3
    g.strokeRect(x0, -4, 34, H + 8)
    // filigree swirls on the outer side
    const out = x0 < cx ? x0 - 6 : x0 + 40
    const dir = x0 < cx ? -1 : 1
    g.lineWidth = 2.5
    for (let y = 30; y < H; y += 70) {
      g.beginPath()
      g.moveTo(out, y)
      g.bezierCurveTo(out + dir * 40, y - 20, out + dir * 55, y + 25, out + dir * 22, y + 28)
      g.bezierCurveTo(out + dir * 4, y + 30, out + dir * 8, y + 10, out + dir * 22, y + 12)
      g.stroke()
    }
  }
  panel(cx - 62)
  panel(cx + 28)
  // buttons down the placket
  for (let y = 40; y < H; y += 90) {
    g.fillStyle = '#f7efe4'; g.beginPath(); g.arc(cx, y, 6, 0, Math.PI * 2); g.fill()
    g.strokeStyle = 'rgba(150,110,80,.5)'; g.lineWidth = 1.5; g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** Cat-eye lens outline (upswept outer corner). side = 1 right lens, -1 left lens. */
function catEyeShape(side: 1 | -1) {
  const s = new THREE.Shape()
  const w = 0.3, h = 0.17
  s.moveTo(-w * side, 0)
  s.bezierCurveTo(-w * side, h * 0.9, -w * 0.2 * side, h * 1.05, w * 0.35 * side, h * 0.95)
  s.bezierCurveTo(w * 0.85 * side, h * 0.9, w * 1.15 * side, h * 1.35, w * 1.1 * side, h * 0.55) // flick
  s.bezierCurveTo(w * 1.05 * side, -h * 0.55, w * 0.4 * side, -h * 1.05, -w * 0.15 * side, -h * 0.95)
  s.bezierCurveTo(-w * 0.75 * side, -h * 0.85, -w * side, -h * 0.5, -w * side, 0)
  return s
}

function Sunglasses({ slide }: { slide: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const frame = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0b0c0e', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 }), [])
  const lens = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#05070a', roughness: 0.05, metalness: 0.4, clearcoat: 1 }), [])
  const geo = useMemo(() => {
    const mk = (side: 1 | -1, depth: number, bevel: number) =>
      new THREE.ExtrudeGeometry(catEyeShape(side), { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 24 })
    return { fR: mk(1, 0.05, 0.035), fL: mk(-1, 0.05, 0.035), lR: mk(1, 0.02, 0.004), lL: mk(-1, 0.02, 0.004) }
  }, [])

  useFrame((_, dt) => {
    if (!group.current) return
    group.current.position.y = damp(group.current.position.y, 0.1 - slide.current * 0.2, 7, dt)
    group.current.position.z = damp(group.current.position.z, 0.7 + slide.current * 0.08, 7, dt)
    group.current.rotation.x = damp(group.current.rotation.x, slide.current * 0.25, 7, dt)
  })

  return (
    <group ref={group} position={[0, 0.1, 0.7]}>
      {([[1, 0.3], [-1, -0.3]] as const).map(([side, x]) => (
        <group key={side} position={[x, 0, 0]} rotation={[0, side * 0.32, 0]}>
          <mesh geometry={side === 1 ? geo.fR : geo.fL} material={frame} position={[0, 0, -0.03]} />
          <mesh geometry={side === 1 ? geo.lR : geo.lL} material={lens} position={[0, 0, 0.055]} scale={[0.86, 0.8, 1]} />
          {/* little glint */}
          <mesh position={[-0.08 * side, 0.06, 0.095]} rotation={[0, 0, 0.6 * side]}>
            <planeGeometry args={[0.1, 0.018]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
      {/* bridge */}
      <mesh position={[0, 0.02, 0.02]} rotation={[0, 0, Math.PI / 2]} material={frame}>
        <cylinderGeometry args={[0.028, 0.028, 0.16, 12]} />
      </mesh>
      {/* temples back to the ears */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.66, 0.06, -0.32]} rotation={[0, s * 0.16, 0]} material={frame}>
          <boxGeometry args={[0.035, 0.04, 0.62]} />
        </mesh>
      ))}
    </group>
  )
}

function Avatar({ reduced, poke, pointer }: Omit<Props, 'active'>) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const hair = useRef<THREE.Group>(null)
  const slide = useRef(0) // 0 = glasses on, 1 = slid down to peek
  const peekUntil = useRef(0)
  const lastPoke = useRef(0)

  const skin = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#e6b99f', roughness: 0.6, sheen: 0.25, sheenColor: new THREE.Color('#ffcfc2') }), [])
  const hairMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f1012', roughness: 0.42, sheen: 1, sheenColor: new THREE.Color('#5a6470'), side: THREE.DoubleSide }), [])
  const barongMap = useMemo(barongTexture, [])
  // sheer organza: soft sheen + slight translucency
  const barong = useMemo(() => new THREE.MeshPhysicalMaterial({ map: barongMap, roughness: 0.45, sheen: 0.5, sheenRoughness: 0.4, sheenColor: new THREE.Color('#ffe6d2'), clearcoat: 0.12, clearcoatRoughness: 0.5, transparent: true, opacity: 0.97 }), [barongMap])
  const organza = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#d6b093', roughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color('#ffe6d2'), clearcoat: 0.12, transparent: true, opacity: 0.94 }), [])
  const collarMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#d4ab8c', roughness: 0.5, sheen: 0.8, sheenColor: new THREE.Color('#ffe7d6') }), [])
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d8b46a', metalness: 1, roughness: 0.22 }), [])
  const blush = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ff8f9a', transparent: true, opacity: 0.42, depthWrite: false }), [])
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1214', roughness: 0.6 }), [])


  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const px = reduced ? 0.2 : pointer.current.x
    const py = reduced ? 0 : pointer.current.y

    if (poke.current !== lastPoke.current) { lastPoke.current = poke.current; peekUntil.current = t + 2.2 }
    slide.current = damp(slide.current, t < peekUntil.current ? 1 : 0, 6, dt)

    if (root.current) {
      root.current.position.y = reduced ? 0 : Math.sin(t * 1.2) * 0.04
      root.current.rotation.y = damp(root.current.rotation.y, px * 0.3, 3, dt)
    }
    if (head.current) {
      head.current.rotation.y = damp(head.current.rotation.y, px * 0.45, 5, dt)
      head.current.rotation.x = damp(head.current.rotation.x, -py * 0.25 + slide.current * 0.12, 5, dt)
      head.current.rotation.z = damp(head.current.rotation.z, -px * 0.08 + (reduced ? 0 : Math.sin(t * 0.8) * 0.03), 4, dt)
    }
    if (hair.current) hair.current.rotation.z = reduced ? 0 : Math.sin(t * 1.1) * 0.015 - px * 0.03
  })

  const mouth = onFace(0, -0.3)
  const browY = 0.36

  return (
    <group ref={root} position={[0, -0.15, 0]}>
      {/* ── barong body: front centre faces the camera (thetaStart = π) ── */}
      <mesh position={[0, -1.32, 0]} material={barong} castShadow>
        <cylinderGeometry args={[0.56, 0.98, 1.25, 64, 1, false, Math.PI, Math.PI * 2]} />
      </mesh>
      {/* shoulders */}
      <mesh position={[0, -0.72, 0]} material={organza} scale={[1.08, 0.55, 1]}>
        <sphereGeometry args={[0.6, 48, 24]} />
      </mesh>
      {/* sleeves hanging from the shoulders */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.68, -1.25, 0.02]} rotation={[0, 0, s * 0.16]} material={organza}>
          <capsuleGeometry args={[0.17, 0.85, 8, 20]} />
        </mesh>
      ))}
      {/* mandarin stand collar */}
      <mesh position={[0, -0.42, 0]} material={collarMat}>
        <cylinderGeometry args={[0.27, 0.31, 0.2, 40, 1, true]} />
      </mesh>
      <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={collarMat}>
        <torusGeometry args={[0.27, 0.018, 10, 48]} />
      </mesh>

      {/* ── head ── */}
      <group ref={head} position={[0, 0.42, 0]}>
        <mesh material={skin} scale={[1.04, 0.96, 0.95]} castShadow>
          <sphereGeometry args={[HEAD_R, 64, 64]} />
        </mesh>
        {/* ears */}
        {[1, -1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.75, 0.02, -0.02]} scale={[0.55, 1, 0.8]} material={skin}>
              <sphereGeometry args={[0.17, 24, 24]} />
            </mesh>
            {/* gold hoop */}
            <mesh position={[s * 0.8, -0.17, 0.02]} rotation={[0, s * 0.5, 0]} material={gold}>
              <torusGeometry args={[0.065, 0.022, 16, 32]} />
            </mesh>
          </group>
        ))}
        {/* brows */}
        {[1, -1].map((s) => (
          <mesh key={s} position={[s * 0.27, browY - 0.04, onFace(s * 0.27, browY - 0.04).z - 0.01]} rotation={[0, s * 0.35, s * -0.12]} material={dark}>
            <capsuleGeometry args={[0.018, 0.16, 6, 12]} />
          </mesh>
        ))}
        {/* eyes behind the glasses (visible when she peeks) */}
        {[1, -1].map((s) => (
          <group key={s} position={[s * 0.28, 0.06, onFace(s * 0.28, 0.06).z - 0.01]} rotation={[0, s * 0.35, 0]}>
            <mesh material={dark} scale={[1, 1.25, 0.4]}><sphereGeometry args={[0.07, 20, 20]} /></mesh>
            <mesh position={[0.02, 0.03, 0.03]}><sphereGeometry args={[0.018, 12, 12]} /><meshBasicMaterial color="#ffffff" /></mesh>
          </group>
        ))}
        {/* blush */}
        {[1, -1].map((s) => {
          const p = onFace(s * 0.4, -0.2)
          return (
            <mesh key={s} position={p} rotation={[0, s * 0.5, 0]} material={blush}>
              <circleGeometry args={[0.15, 32]} />
            </mesh>
          )
        })}
        {/* tiny pout */}
        <mesh position={[mouth.x, mouth.y, mouth.z]} rotation={[0, 0, 0]} material={dark}>
          <torusGeometry args={[0.045, 0.009, 8, 24, Math.PI]} />
        </mesh>

        <Sunglasses slide={slide} />

        {/* ── hair ── */}
        <group ref={hair}>
          {/* crown with a centre part */}
          {[1, -1].map((s) => (
            <mesh key={s} rotation={[-0.5, 0, s * 0.05]} material={hairMat}>
              <sphereGeometry args={[0.84, 48, 32, s === 1 ? 0 : Math.PI, Math.PI, 0, 1.75]} />
            </mesh>
          ))}
          {/* long sheet down the back and sides */}
          <mesh position={[0, -0.75, -0.05]} material={hairMat}>
            <cylinderGeometry args={[0.84, 1.02, 1.75, 64, 1, true, Math.PI * 0.3, Math.PI * 1.4]} />
          </mesh>
          {/* second, fuller layer for volume */}
          <mesh position={[0, -0.85, -0.08]} material={hairMat}>
            <cylinderGeometry args={[0.9, 1.1, 1.6, 64, 1, true, Math.PI * 0.36, Math.PI * 1.28]} />
          </mesh>
          {/* face-framing locks */}
          {[1, -1].map((s) => (
            <mesh key={s} position={[s * 0.72, -0.4, 0.3]} rotation={[0.1, s * -0.35, s * 0.05]} scale={[1.7, 1, 0.45]} material={hairMat}>
              <capsuleGeometry args={[0.12, 1.4, 8, 20]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}

export default function AvatarScene({ active, reduced, poke, pointer }: Props) {
  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, -0.1, 7.4], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.9 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.5, 4, 5]} intensity={1.15} castShadow />
      <pointLight position={[-3, 1, 2]} intensity={7} distance={8} color="#6FD6EA" />
      <pointLight position={[3, -0.5, 1.5]} intensity={5} distance={8} color="#A8E8F4" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 3]} scale={[6, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.4} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} color="#6FD6EA" />
        <Lightformer form="rect" intensity={1.2} position={[4, 1, 0]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} color="#A8E8F4" />
      </Environment>
      <Avatar reduced={reduced} poke={poke} pointer={pointer} />
      <ContactShadows position={[0, -2.0, 0]} scale={5} blur={2.6} far={2} opacity={0.45} color="#000" />
      {!reduced && <Sparkles count={24} scale={[5, 4, 3]} size={2} speed={0.3} color="#A8E8F4" opacity={0.5} />}
    </Canvas>
  )
}

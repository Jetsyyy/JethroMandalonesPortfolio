import { useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox, Sparkles } from '@react-three/drei'

type Props = { active: boolean; reduced: boolean; poke: MutableRefObject<number>; pointer: MutableRefObject<{ x: number; y: number }> }

const damp = THREE.MathUtils.damp

/** Aurora visor: dark glass with a lime → emerald → cyan sheen and a JM mark on the forehead. */
function visorTexture() {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 320
  const g = c.getContext('2d')!
  const bg = g.createLinearGradient(0, 0, 512, 320)
  bg.addColorStop(0, '#03100f'); bg.addColorStop(1, '#061c1b')
  g.fillStyle = bg; g.fillRect(0, 0, 512, 320)
  const sheen = g.createLinearGradient(0, 320, 512, 0)
  sheen.addColorStop(0, 'rgba(198,244,50,0)')
  sheen.addColorStop(0.35, 'rgba(198,244,50,.28)')
  sheen.addColorStop(0.55, 'rgba(46,229,157,.35)')
  sheen.addColorStop(0.75, 'rgba(34,211,238,.32)')
  sheen.addColorStop(1, 'rgba(34,211,238,0)')
  g.fillStyle = sheen; g.fillRect(0, 0, 512, 320)
  // scanlines
  g.fillStyle = 'rgba(139,229,213,.05)'
  for (let y = 0; y < 320; y += 6) g.fillRect(0, y, 512, 2)
  g.fillStyle = 'rgba(139,229,213,.55)'
  g.font = '600 28px "JetBrains Mono", monospace'
  g.textAlign = 'center'
  g.fillText('JM·AI', 256, 52)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Robot({ reduced, poke, pointer }: Omit<Props, 'active'>) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const torso = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const visor = useMemo(visorTexture, [])
  const spin = useRef(0)
  const lastPoke = useRef(0)

  const white = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#eef5f3', roughness: 0.28, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12 }), [])
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b9c9c6', roughness: 0.18, metalness: 1 }), [])
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0d1f1e', roughness: 0.4, metalness: 0.6 }), [])
  const glow = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2EE59D', emissive: '#2EE59D', emissiveIntensity: 2.2, toneMapped: false }), [])
  const glowLime = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C6F432', emissive: '#C6F432', emissiveIntensity: 2.4, toneMapped: false }), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const px = reduced ? 0.25 : pointer.current.x
    const py = reduced ? 0 : pointer.current.y

    if (poke.current !== lastPoke.current) { lastPoke.current = poke.current; spin.current += Math.PI * 2 }

    if (root.current) {
      root.current.position.y = reduced ? 0 : Math.sin(t * 1.4) * 0.08
      root.current.rotation.y = damp(root.current.rotation.y, px * 0.35 + spin.current, spin.current ? 2.2 : 3, dt)
    }
    if (head.current) {
      head.current.rotation.y = damp(head.current.rotation.y, px * 0.55, 5, dt)
      head.current.rotation.x = damp(head.current.rotation.x, -py * 0.35, 5, dt)
      head.current.rotation.z = damp(head.current.rotation.z, reduced ? 0 : Math.sin(t * 0.7) * 0.04 - px * 0.08, 4, dt)
    }
    if (torso.current) torso.current.rotation.x = damp(torso.current.rotation.x, -py * 0.08, 3, dt)
    if (armL.current) armL.current.rotation.z = reduced ? 0.25 : 0.25 + Math.sin(t * 1.4) * 0.06
    if (armR.current) {
      // friendly wave every few seconds
      const w = (t % 6) < 1.6 && !reduced ? Math.sin(((t % 6) / 1.6) * Math.PI) : 0
      armR.current.rotation.z = -0.25 - w * 2.1
      armR.current.rotation.x = -w * 0.3 + Math.sin(t * 8) * w * 0.25
    }
    if (eyes.current) {
      const blink = (t % 3.7) < 0.12 ? 0.1 : 1
      eyes.current.scale.y = damp(eyes.current.scale.y, blink, 30, dt)
    }
    if (ring.current) {
      ring.current.rotation.z += dt * 0.6
      ;(ring.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.6 + Math.sin(t * 2) * 0.5
    }
  })

  return (
    <group ref={root} position={[0, -0.05, 0]}>
      {/* hover ring */}
      <mesh ref={ring} position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.025, 16, 96]} />
        <meshStandardMaterial color="#2EE59D" emissive="#2EE59D" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 64]} />
        <meshBasicMaterial color="#2EE59D" transparent opacity={0.12} />
      </mesh>

      {/* torso */}
      <group ref={torso}>
        <RoundedBox args={[1.25, 1.2, 0.85]} radius={0.32} smoothness={6} position={[0, -0.75, 0]} material={white} castShadow />
        <RoundedBox args={[0.62, 0.42, 0.06]} radius={0.08} smoothness={4} position={[0, -0.62, 0.42]} material={dark} />
        <mesh position={[0, -0.62, 0.456]} material={glowLime}>
          <circleGeometry args={[0.07, 32]} />
        </mesh>
        {[-0.18, 0.18].map((x) => (
          <mesh key={x} position={[x, -0.62, 0.456]} material={glow}>
            <planeGeometry args={[0.12, 0.025]} />
          </mesh>
        ))}
        <mesh position={[0, -1.4, 0]} material={chrome}>
          <cylinderGeometry args={[0.32, 0.18, 0.3, 32]} />
        </mesh>
        {/* neck */}
        <mesh position={[0, -0.06, 0]} material={chrome}>
          <cylinderGeometry args={[0.14, 0.18, 0.24, 24]} />
        </mesh>
        {/* arms */}
        {([[-1, armL], [1, armR]] as const).map(([s, ref]) => (
          <group key={s} ref={ref} position={[s * 0.72, -0.42, 0]}>
            <mesh material={chrome}><sphereGeometry args={[0.17, 32, 32]} /></mesh>
            <mesh position={[s * 0.08, -0.38, 0]} rotation={[0, 0, s * 0.12]} material={white} castShadow>
              <capsuleGeometry args={[0.12, 0.42, 8, 16]} />
            </mesh>
            <mesh position={[s * 0.13, -0.78, 0.02]} material={chrome}><sphereGeometry args={[0.13, 24, 24]} /></mesh>
          </group>
        ))}
      </group>

      {/* head */}
      <group ref={head} position={[0, 0.48, 0]}>
        <RoundedBox args={[1.32, 0.98, 1.05]} radius={0.34} smoothness={6} material={white} castShadow />
        {/* visor */}
        <RoundedBox args={[1.08, 0.66, 0.1]} radius={0.2} smoothness={5} position={[0, -0.02, 0.5]}>
          <meshPhysicalMaterial map={visor} emissiveMap={visor} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.08} metalness={0.3} clearcoat={1} />
        </RoundedBox>
        <group ref={eyes} position={[0, -0.04, 0.565]}>
          {[-0.22, 0.22].map((x) => (
            <mesh key={x} position={[x, 0, 0]} material={glow}>
              <capsuleGeometry args={[0.055, 0.12, 6, 16]} />
            </mesh>
          ))}
        </group>
        {/* ear pods */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.69, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]}>
            <mesh material={chrome}><cylinderGeometry args={[0.2, 0.2, 0.1, 32]} /></mesh>
            <mesh position={[0, s * 0.055, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.13, 0.018, 12, 48]} />
              <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2} toneMapped={false} />
            </mesh>
          </group>
        ))}
        {/* antenna */}
        <mesh position={[0.32, 0.62, -0.1]} rotation={[0, 0, -0.25]} material={chrome}>
          <cylinderGeometry args={[0.018, 0.018, 0.34, 12]} />
        </mesh>
        <mesh position={[0.36, 0.8, -0.1]} material={glowLime}><sphereGeometry args={[0.055, 20, 20]} /></mesh>
      </group>
    </group>
  )
}

export default function RobotScene({ active, reduced, poke, pointer }: Props) {
  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 6.3], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1 }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} castShadow />
      <pointLight position={[-2.5, 0.5, 2]} intensity={8} distance={7} color="#2EE59D" />
      <pointLight position={[2.5, -0.5, 1.5]} intensity={6} distance={7} color="#22D3EE" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 3]} scale={[6, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} color="#2EE59D" />
        <Lightformer form="rect" intensity={1.4} position={[4, 1, 0]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} color="#22D3EE" />
        <Lightformer form="ring" intensity={1} position={[0, -3, 2]} scale={2} color="#C6F432" />
      </Environment>
      <Robot reduced={reduced} poke={poke} pointer={pointer} />
      <ContactShadows position={[0, -2.08, 0]} scale={5} blur={2.6} far={2} opacity={0.5} color="#000" />
      {!reduced && <Sparkles count={30} scale={[5, 4, 3]} size={2} speed={0.3} color="#8BE5D5" opacity={0.6} />}
    </Canvas>
  )
}

import { useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox, Sparkles } from '@react-three/drei'
import { keyboardTexture, matTexture, monogramTexture, phoneTexture, screenTexture } from './textures'

type Props = { progress: MutableRefObject<number>; reduced: boolean; active: boolean }

const damp = THREE.MathUtils.damp
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/* ───────── objects ───────── */

function Mat() {
  const map = useMemo(matTexture, [])
  return (
    <RoundedBox args={[11, 0.08, 7.3]} radius={0.035} smoothness={3} position={[0, -0.04, 0]} receiveShadow>
      <meshStandardMaterial map={map} roughness={0.92} metalness={0} />
    </RoundedBox>
  )
}

function Laptop({ progress, reduced }: { progress: MutableRefObject<number>; reduced: boolean }) {
  const hinge = useRef<THREE.Group>(null)
  const screenMat = useRef<THREE.MeshStandardMaterial>(null)
  const { tex: screen, draw } = useMemo(screenTexture, [])
  const keys = useMemo(keyboardTexture, [])

  useEffect(() => {
    let on = true
    const t = setInterval(() => { on = !on; draw(on) }, 530)
    return () => clearInterval(t)
  }, [draw])

  useFrame((_, dt) => {
    const p = reduced ? 1 : clamp01(progress.current / 0.6)
    const target = -0.45 - ease(p) * 1.42 // slightly open → ~108°
    if (hinge.current) hinge.current.rotation.x = damp(hinge.current.rotation.x, target, 6, dt)
    if (screenMat.current) screenMat.current.emissiveIntensity = damp(screenMat.current.emissiveIntensity, 0.35 + ease(p) * 0.9, 6, dt)
  })

  const W = 3.6, D = 2.45, baseH = 0.12, lidH = 0.07
  return (
    <group position={[0.35, 0, -0.35]} rotation={[0, -0.22, 0]}>
      {/* base */}
      <RoundedBox args={[W, baseH, D]} radius={0.05} smoothness={4} position={[0, baseH / 2, 0]} castShadow>
        <meshStandardMaterial color="#2C4350" metalness={0.7} roughness={0.32} />
      </RoundedBox>
      <mesh position={[0, baseH + 0.001, -0.22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.9, D * 0.42]} />
        <meshStandardMaterial map={keys} roughness={0.7} />
      </mesh>
      <mesh position={[0, baseH + 0.001, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 0.72]} />
        <meshStandardMaterial color="#14252E" roughness={0.45} metalness={0.4} />
      </mesh>
      {/* lid on a hinge at the back edge */}
      <group ref={hinge} position={[0, baseH, -D / 2]} rotation={[-0.45, 0, 0]}>
        <group rotation={[Math.PI, 0, 0]}>
          <RoundedBox args={[W, lidH, D]} radius={0.03} smoothness={4} position={[0, -lidH / 2, -D / 2]} castShadow>
            <meshStandardMaterial color="#2C4350" metalness={0.7} roughness={0.3} />
          </RoundedBox>
          {/* aqua logo on the lid back */}
          <mesh position={[0, -lidH - 0.001, -D / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.16, 40]} />
            <meshStandardMaterial color="#3CC4DC" emissive="#3CC4DC" emissiveIntensity={0.6} />
          </mesh>
          {/* screen */}
          <mesh position={[0, 0.006, -D / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W * 0.93, D * 0.9]} />
            <meshStandardMaterial ref={screenMat} map={screen} emissive="#ffffff" emissiveMap={screen} emissiveIntensity={0.35} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function Puck() {
  const top = useMemo(monogramTexture, [])
  return (
    <group position={[-3.55, 0, 1.25]}>
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.82, 0.86, 0.22, 64]} />
        <meshStandardMaterial color="#2FA9C2" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.221, 0]} rotation={[-Math.PI / 2, 0, -0.4]}>
        <circleGeometry args={[0.8, 64]} />
        <meshStandardMaterial map={top} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Pencil() {
  return (
    <group position={[-3.1, 0.09, -1.9]} rotation={[0, 0.85, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.09, 3.1, 6]} />
        <meshStandardMaterial color="#A8E8F4" roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.72, 0]} castShadow>
        <coneGeometry args={[0.09, 0.34, 6]} />
        <meshStandardMaterial color="#d9b48a" roughness={0.8} />
      </mesh>
      <mesh position={[0, -1.85, 0]}>
        <coneGeometry args={[0.03, 0.09, 12]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.12, 16]} />
        <meshStandardMaterial color="#9AA8AE" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Phone() {
  const ui = useMemo(phoneTexture, [])
  return (
    <group position={[3.95, 0, 1.35]} rotation={[0, 0.35, 0]}>
      <RoundedBox args={[0.92, 0.08, 1.84]} radius={0.035} smoothness={4} position={[0, 0.04, 0]} castShadow>
        <meshStandardMaterial color="#14252E" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.084, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.84, 1.72]} />
        <meshStandardMaterial map={ui} emissive="#ffffff" emissiveMap={ui} emissiveIntensity={0.55} roughness={0.2} />
      </mesh>
    </group>
  )
}

/* ───────── camera + interaction ───────── */

function Rig({ progress, reduced, children }: { progress: MutableRefObject<number>; reduced: boolean; children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const { camera, pointer, size } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  const narrow = size.width < 768

  useFrame((_, dt) => {
    const p = reduced ? 0.7 : ease(clamp01(progress.current))
    // top-down "flat lay" → low, cinematic three-quarter view of the laptop
    const from = narrow ? new THREE.Vector3(0, 15, 4.5) : new THREE.Vector3(0.6, 11.5, 3.2)
    const to = narrow ? new THREE.Vector3(1.2, 4.2, 8.4) : new THREE.Vector3(2.6, 3.3, 6.4)
    const target = from.lerp(to, p)
    camera.position.x = damp(camera.position.x, target.x, 3, dt)
    camera.position.y = damp(camera.position.y, target.y, 3, dt)
    camera.position.z = damp(camera.position.z, target.z, 3, dt)
    // desktop: frame the laptop on the right so the pitch text has room on the left
    // phone: lift the laptop to the top half so the pitch sits underneath it
    look.set(
      THREE.MathUtils.lerp(0, narrow ? 0.4 : -1.25, p),
      THREE.MathUtils.lerp(0, narrow ? -0.35 : 0.7, p),
      THREE.MathUtils.lerp(0, -0.6, p),
    )
    camera.lookAt(look)
    if (group.current && !reduced) {
      group.current.rotation.y = damp(group.current.rotation.y, pointer.x * 0.12, 3, dt)
      group.current.rotation.x = damp(group.current.rotation.x, -pointer.y * 0.05, 3, dt)
    }
  })
  return <group ref={group}>{children}</group>
}

export default function DeskScene({ progress, reduced, active }: Props) {
  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0.6, 11.5, 3.2], fov: 38, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05 }}
    >
      <color attach="background" args={['#061C24']} />
      <fog attach="fog" args={['#061C24', 14, 30]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 9, 4]} intensity={1.9} color="#E6F3F7" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004}>
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
      </directionalLight>
      <pointLight position={[3, 2.5, 2]} intensity={6} distance={9} color="#3CC4DC" />

      {/* studio reflections without loading an HDR file */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[0, 6, -4]} scale={[10, 3, 1]} color="#E6F3F7" />
        <Lightformer form="rect" intensity={1.4} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#A8E8F4" />
        <Lightformer form="ring" intensity={1.2} position={[5, 3, 3]} scale={2} color="#3CC4DC" />
      </Environment>

      <Rig progress={progress} reduced={reduced}>
        <Mat />
        <Laptop progress={progress} reduced={reduced} />
        <Puck />
        <Pencil />
        <Phone />
        <ContactShadows position={[0, 0.005, 0]} scale={12} blur={2.4} far={2.5} opacity={0.55} color="#000000" />
        {!reduced && <Sparkles count={40} scale={[12, 4, 8]} position={[0, 2, 0]} size={2.2} speed={0.25} color="#A8E8F4" opacity={0.5} />}
      </Rig>
    </Canvas>
  )
}

'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { ParticleField } from '../components/objects/ParticleField'

interface Scene06Props {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export const Scene06_Convergence = ({ scrollProgress, mouseX, mouseY }: Scene06Props) => {
  const sceneVisible = scrollProgress >= 0.88 && scrollProgress <= 0.98
  // @ts-ignore — drei Text ref typing
  const heRef = useRef<THREE.Mesh>(null)

  // Fixed 6 refs (no hooks in loops)
  const r0 = useRef<THREE.Mesh>(null)
  const r1 = useRef<THREE.Mesh>(null)
  const r2 = useRef<THREE.Mesh>(null)
  const r3 = useRef<THREE.Mesh>(null)
  const r4 = useRef<THREE.Mesh>(null)
  const r5 = useRef<THREE.Mesh>(null)

  // Convergence progress: 0→1 as scroll goes 88%→97%
  const convergence = Math.max(0, Math.min(1, (scrollProgress - 0.88) / 0.09))

  const startPositions: [number, number, number][] = [
    [-3,  2,   -1  ],
    [ 3,  1,   -0.5],
    [-2, -2,   -1.5],
    [ 2, -1.5, -0.8],
    [ 0,  3,   -2  ],
    [-1, -3,   -1  ],
  ]

  const meshRefs = [r0, r1, r2, r3, r4, r5]

  useFrame(({ clock }) => {
    // Pulse the ה letter
    if (heRef.current) {
      const mat = heRef.current.material as THREE.MeshStandardMaterial
      if (mat) {
        const pulse = Math.sin(clock.elapsedTime * 2) * 0.3 + 1.2
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          convergence * pulse,
          0.05
        )
      }
    }

    // Converging particles (small spheres representing design elements)
    meshRefs.forEach((ref, i) => {
      if (!ref.current) return
      const [sx, sy, sz] = startPositions[i]
      const tx = sx + (0 - sx) * convergence
      const ty = sy + (0 - sy) * convergence
      const tz = sz + (0 - sz) * convergence
      ref.current.position.set(
        THREE.MathUtils.lerp(ref.current.position.x, tx, 0.06),
        THREE.MathUtils.lerp(ref.current.position.y, ty, 0.06),
        THREE.MathUtils.lerp(ref.current.position.z, tz, 0.06)
      )
    })
  })

  return (
    <group visible={sceneVisible}>
      <ParticleField
        mouseX={mouseX}
        mouseY={mouseY}
        scrollProgress={scrollProgress}
      />

      {/* The ה letter — glows as convergence increases */}
      {/* @ts-ignore */}
      <Text
        ref={heRef}
        font="/fonts/Heebo.ttf"
        fontSize={3}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
      >
        ה
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={0}
          transparent
          opacity={convergence}
        />
      </Text>

      {/* Converging elements */}
      {startPositions.map((pos, i) => (
        <mesh key={i} ref={meshRefs[i]} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#4a9eff" transparent opacity={1} />
        </mesh>
      ))}
    </group>
  )
}

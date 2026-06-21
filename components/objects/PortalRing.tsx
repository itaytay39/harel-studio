'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface PortalRingProps {
  radius: number
  speed: number
  portalProgress: number // 0–1 as portal opens
}

export const PortalRing = ({ radius, speed, portalProgress }: PortalRingProps) => {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    // Rotate
    ref.current.rotation.z = clock.elapsedTime * speed
    // Scale with portal progress
    const targetScale = 1 + portalProgress * 2.5
    ref.current.scale.setScalar(
      THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.08)
    )
    // Opacity fades in with portal
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, portalProgress * 0.7, 0.08)
  })

  return (
    <mesh ref={ref} position={[0, 0.04, 0.1]}>
      <ringGeometry args={[radius, radius + 0.015, 64]} />
      <meshBasicMaterial
        color="#4a9eff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

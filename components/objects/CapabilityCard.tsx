'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export interface CapabilityCardProps {
  heTitle: string
  enTitle: string
  icon: string
  position: [number, number, number]
  mouseX: number
  mouseY: number
  index: number
}

export const CapabilityCard = ({
  heTitle,
  enTitle,
  icon,
  position,
  mouseX,
  mouseY,
  index,
}: CapabilityCardProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const borderRef = useRef<THREE.Mesh>(null)
  const hovered = useRef(false)

  useFrame(() => {
    if (!groupRef.current) return

    // Magnetic effect — card drifts toward mouse
    const tx = position[0] + (mouseX - 0.5) * 0.3
    const ty = position[1] + (mouseY - 0.5) * -0.2
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, tx, 0.05)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, ty, 0.05)
    groupRef.current.position.z = position[2]

    // Subtle tilt toward mouse
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      (mouseX - 0.5) * 0.15,
      0.05
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      (mouseY - 0.5) * -0.1,
      0.05
    )

    // Border glow on hover
    if (borderRef.current) {
      const mat = borderRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, hovered.current ? 0.7 : 0.22, 0.1)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Glass background */}
      <mesh>
        <boxGeometry args={[1.6, 1.0, 0.01]} />
        <meshPhysicalMaterial
          color="#020d1a"
          transparent
          opacity={0.75}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Border glow */}
      <mesh ref={borderRef} position={[0, 0, 0.006]}>
        <boxGeometry args={[1.61, 1.01, 0.001]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.22}
          wireframe
        />
      </mesh>

      {/* Icon */}
      <Text
        font="/fonts/SpaceGrotesk.ttf"
        fontSize={0.22}
        color="#4a9eff"
        position={[0, 0.22, 0.015]}
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>

      {/* Hebrew title */}
      <Text
        font="/fonts/Heebo.ttf"
        fontSize={0.12}
        color="#f0f4ff"
        position={[0, -0.02, 0.015]}
        anchorX="center"
        anchorY="middle"
      >
        {heTitle}
      </Text>

      {/* English subtitle */}
      <Text
        font="/fonts/SpaceGrotesk.ttf"
        fontSize={0.07}
        color="#7a9abf"
        position={[0, -0.2, 0.015]}
        anchorX="center"
        anchorY="middle"
      >
        {enTitle}
      </Text>
    </group>
  )
}

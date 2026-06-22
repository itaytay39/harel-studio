'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface Scene07Props {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export const Scene07_Landing = ({ scrollProgress }: Scene07Props) => {
  const sceneVisible = scrollProgress >= 0.95
  // @ts-ignore — drei Text ref typing
  const heRef = useRef<THREE.Mesh>(null)

  const progress = Math.max(0, Math.min(1, (scrollProgress - 0.97) / 0.03))

  useFrame(() => {
    if (!heRef.current) return
    // ה shrinks from 3 to 0.3 (logo size) and moves to top-right
    const targetScale = THREE.MathUtils.lerp(3, 0.3, progress)
    heRef.current.scale.setScalar(
      THREE.MathUtils.lerp(heRef.current.scale.x, targetScale, 0.05)
    )
    heRef.current.position.x = THREE.MathUtils.lerp(
      heRef.current.position.x,
      progress * 3.5,
      0.05
    )
    heRef.current.position.y = THREE.MathUtils.lerp(
      heRef.current.position.y,
      progress * 2.5,
      0.05
    )
  })

  return (
    <group visible={sceneVisible}>
      {/* @ts-ignore */}
      <Text
        ref={heRef}
        font="/fonts/Heebo.ttf"
        fontSize={1}
        anchorX="center"
        anchorY="middle"
      >
        ה
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={0.8}
        />
      </Text>
    </group>
  )
}

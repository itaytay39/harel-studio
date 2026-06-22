'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleField } from '../components/objects/ParticleField'

interface Scene04Props {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export const Scene04_Inside = ({ scrollProgress, mouseX, mouseY }: Scene04Props) => {
  const sceneVisible = scrollProgress >= 0.58 && scrollProgress <= 0.77

  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (!lightRef.current) return
    lightRef.current.position.x += ((mouseX - 0.5) * 6 - lightRef.current.position.x) * 0.04
    lightRef.current.position.y += ((mouseY - 0.5) * -4 - lightRef.current.position.y) * 0.04
  })

  return (
    <group visible={sceneVisible}>
      {/* Deep blue ambient */}
      <ambientLight intensity={0.08} color="#020d1a" />
      <pointLight ref={lightRef} position={[0, 2, 3]} intensity={1.2} color="#4a9eff" />

      <ParticleField
        mouseX={mouseX}
        mouseY={mouseY}
        scrollProgress={scrollProgress}
      />
    </group>
  )
}

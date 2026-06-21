'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Monitor } from '../components/objects/Monitor'
import { ParticleField } from '../components/objects/ParticleField'
import { FloatingElements } from '../components/objects/FloatingElements'

interface Scene02Props {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export const Scene02_Reveal = ({ scrollProgress, mouseX, mouseY }: Scene02Props) => {
  const monitorRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!monitorRef.current) return

    // Monitor tilts as user scrolls into scene (0–25% → 0–45°)
    const tilt = Math.min(scrollProgress / 0.25, 1) * (Math.PI / 4) // 0 to 45°
    monitorRef.current.rotation.y = THREE.MathUtils.lerp(
      monitorRef.current.rotation.y,
      tilt,
      0.05
    )
  })

  const sceneVisible = scrollProgress >= 0 && scrollProgress <= 0.30

  return (
    <group visible={sceneVisible}>
      <ParticleField
        mouseX={mouseX}
        mouseY={mouseY}
        scrollProgress={scrollProgress}
      />

      <group ref={monitorRef}>
        <Monitor
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </group>

      <FloatingElements
        mouseX={mouseX}
        mouseY={mouseY}
        visible={scrollProgress > 0.02}
      />
    </group>
  )
}

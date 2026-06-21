'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Monitor } from '../components/objects/Monitor'
import { ParticleField } from '../components/objects/ParticleField'
import { FloatingElements } from '../components/objects/FloatingElements'
import { PortalRing } from '../components/objects/PortalRing'

// Map a value from one range to another, clamped
function mapRange(inMin: number, inMax: number, val: number, outMin: number, outMax: number) {
  const t = Math.max(0, Math.min(1, (val - inMin) / (inMax - inMin)))
  return outMin + (outMax - outMin) * t
}

interface Scene03Props {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export const Scene03_Portal = ({ scrollProgress, mouseX, mouseY }: Scene03Props) => {
  const { camera } = useThree()
  const floatGroupRef = useRef<THREE.Group>(null)

  const portalProgress = scrollProgress > 0.25
    ? Math.min(1, (scrollProgress - 0.25) / 0.35)
    : 0

  const sceneVisible = scrollProgress >= 0.20 && scrollProgress <= 0.65

  useFrame(() => {
    if (!sceneVisible) return
    const p = scrollProgress

    // Camera rushes forward toward monitor screen
    if (p >= 0.25) {
      const targetZ = mapRange(0.25, 0.60, p, 5.0, 0.12)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04)

      const targetFov = mapRange(0.30, 0.60, p, 60, 96)
      const cam = camera as THREE.PerspectiveCamera
      cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 0.04)
      cam.updateProjectionMatrix()
    }

    // Floating elements get sucked into the screen
    if (floatGroupRef.current && p >= 0.30) {
      const suckProgress = mapRange(0.30, 0.55, p, 1, 0)
      floatGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(floatGroupRef.current.scale.x, suckProgress, 0.06)
      )
      // Also move forward toward screen
      floatGroupRef.current.position.z = mapRange(0.30, 0.55, p, 0, 2.0)
    }
  })

  return (
    <group visible={sceneVisible}>
      <ParticleField
        mouseX={mouseX}
        mouseY={mouseY}
        scrollProgress={scrollProgress}
      />

      <Monitor
        scrollProgress={scrollProgress}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Floating elements — sucked into portal */}
      <group ref={floatGroupRef}>
        <FloatingElements
          mouseX={mouseX}
          mouseY={mouseY}
          visible={scrollProgress < 0.55}
        />
      </group>

      {/* Portal rings — 3 at different radii */}
      <PortalRing radius={0.8} speed={0.4}  portalProgress={portalProgress} />
      <PortalRing radius={1.3} speed={-0.3} portalProgress={portalProgress} />
      <PortalRing radius={1.9} speed={0.2}  portalProgress={portalProgress} />
    </group>
  )
}

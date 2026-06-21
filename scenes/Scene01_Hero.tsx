'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { Monitor } from '../components/objects/Monitor'
import { ParticleField } from '../components/objects/ParticleField'

interface Scene01Props {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export const Scene01_Hero = ({ scrollProgress, mouseX, mouseY }: Scene01Props) => {
  const monitorRef   = useRef<THREE.Group>(null)
  const blueLightRef = useRef<THREE.PointLight>(null)
  const { camera }   = useThree()

  // Entry animation — Monitor slides up from below
  useGSAP(() => {
    if (!monitorRef.current) return
    gsap.from(monitorRef.current.position, {
      y: -4,
      duration: 1.8,
      ease: 'power3.out',
      delay: 0.6,
    })
    gsap.from(monitorRef.current.scale, {
      x: 0.8,
      y: 0.8,
      z: 0.8,
      duration: 1.4,
      ease: 'back.out(1.2)',
      delay: 0.6,
    })
  }, [])

  useFrame(() => {
    if (!blueLightRef.current) return

    // Effect 2: Blue light tracks mouse
    blueLightRef.current.position.x += ((mouseX - 0.5) * 10 - blueLightRef.current.position.x) * 0.05
    blueLightRef.current.position.y += ((mouseY - 0.5) * -6 - blueLightRef.current.position.y) * 0.05

    // Effect 3: Camera micro-movement
    camera.position.x += ((mouseX - 0.5) * 0.3 - camera.position.x) * 0.02
    camera.position.y += ((mouseY - 0.5) * -0.2 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })

  return (
    <group>
      {/* Dynamic blue light — follows mouse */}
      <pointLight
        ref={blueLightRef}
        position={[-3, 2, 3]}
        intensity={0.6}
        color="#4a9eff"
      />

      {/* Particles fill the background */}
      <ParticleField
        mouseX={mouseX}
        mouseY={mouseY}
        scrollProgress={scrollProgress}
      />

      {/* The 3D monitor — mouse effects 1 + 4 handled inside Monitor */}
      <group ref={monitorRef}>
        <Monitor
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </group>
    </group>
  )
}

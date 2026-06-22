'use client'
import { useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import Lenis from 'lenis'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useMouseParallax } from '../hooks/useMouseParallax'
import { Scene01_Hero } from '../scenes/Scene01_Hero'
import { Scene02_Reveal } from '../scenes/Scene02_Reveal'
import { Scene03_Portal } from '../scenes/Scene03_Portal'
import { Scene04_Inside } from '../scenes/Scene04_Inside'
import { Scene05_Capabilities } from '../scenes/Scene05_Capabilities'
import { Scene06_Convergence } from '../scenes/Scene06_Convergence'
import { Scene07_Landing } from '../scenes/Scene07_Landing'

gsap.registerPlugin(ScrollTrigger)

function SceneContent({
  scrollProgress,
  mouseX,
  mouseY,
}: {
  scrollProgress: number
  mouseX: number
  mouseY: number
}) {
  // Chromatic aberration offset — a Vector2 that changes with scroll
  const aberrationOffset = useMemo(() => new THREE.Vector2(0, 0), [])

  // Update chromatic aberration based on scroll
  const portalProgress =
    scrollProgress > 0.25
      ? Math.min(1, (scrollProgress - 0.25) / 0.35)
      : 0
  aberrationOffset.set(
    (mouseX - 0.5) * portalProgress * 0.006,
    (mouseY - 0.5) * portalProgress * 0.004
  )

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.12} />
      <pointLight position={[5, 5, 5]} intensity={1.4} color="#fff8f0" />
      <pointLight position={[-3, 2, 3]} intensity={0.6} color="#4a9eff" />
      <spotLight
        position={[0, 6, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.8}
        castShadow
      />

      {/* HDRI environment — reflections only, no background */}
      <Environment files="/hdri/studio.hdr" background={false} />

      {/* Post processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          intensity={1.1}
          mipmapBlur
        />
        <ChromaticAberration offset={aberrationOffset} />
        <Vignette offset={0.12} darkness={0.75} />
      </EffectComposer>
    </>
  )
}

export const Experience = () => {
  const scrollProgress = useScrollProgress()
  const { x: mouseX, y: mouseY } = useMouseParallax()

  useGSAP(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time: number) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Pin the canvas while scroll container scrolls
    ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#canvas-wrapper',
      pinSpacing: false,
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh' }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: 'high-performance',
      }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <SceneContent
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Scene01_Hero
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Scene02_Reveal
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Scene03_Portal
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Scene04_Inside
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Scene05_Capabilities
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Scene06_Convergence
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Scene07_Landing
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Suspense>
    </Canvas>
  )
}

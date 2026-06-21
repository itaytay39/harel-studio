'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RenderTexture, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'

// ScreenContent renders INSIDE the monitor screen via RenderTexture
const ScreenContent = () => {
  const lineRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!lineRef.current) return
    lineRef.current.scale.x = 0.5 + Math.sin(clock.elapsedTime * 0.8) * 0.3
  })

  return (
    <>
      <color attach="background" args={['#020d1a']} />

      {/* Hebrew title */}
      <Text
        font="/fonts/Heebo.ttf"
        fontSize={0.18}
        color="#f0f4ff"
        position={[0, 0.35, 0]}
        anchorX="center"
        anchorY="middle"
      >
        עיצוב שמספר סיפור
      </Text>

      {/* Animated graph line */}
      <mesh ref={lineRef} position={[0, 0, 0]}>
        <planeGeometry args={[1.2, 0.002]} />
        <meshBasicMaterial color="#4a9eff" />
      </mesh>

      {/* Data points */}
      {([-0.4, -0.1, 0.2, 0.5] as number[]).map((x, i) => (
        <mesh key={i} position={[x, Math.sin(i * 1.2) * 0.15, 0]}>
          <circleGeometry args={[0.018, 16]} />
          <meshBasicMaterial color="#4a9eff" />
        </mesh>
      ))}

      {/* Labels */}
      {(['עיצוב', 'מיתוג', 'תנועה', 'UX'] as string[]).map((label, i) => (
        <Text
          key={i}
          font="/fonts/Heebo.ttf"
          fontSize={0.06}
          color="#7a9abf"
          position={[-0.45 + i * 0.3, -0.25, 0]}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      ))}

      {/* Glow ring */}
      <mesh>
        <ringGeometry args={[0.58, 0.582, 64]} />
        <meshBasicMaterial color="#4a9eff" transparent opacity={0.15} />
      </mesh>
    </>
  )
}

export interface MonitorProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export const Monitor = ({ scrollProgress, mouseX, mouseY }: MonitorProps) => {
  const groupRef     = useRef<THREE.Group>(null)
  const screenMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const targetRot    = useMemo(() => ({ x: 0, y: 0 }), [])

  useFrame(({ clock }) => {
    if (!groupRef.current || !screenMatRef.current) return

    // Idle float
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.08

    // Mouse rotation — damped
    targetRot.y = (mouseX - 0.5) * 0.5
    targetRot.x = (mouseY - 0.5) * -0.3
    groupRef.current.rotation.y += (targetRot.y - groupRef.current.rotation.y) * 0.04
    groupRef.current.rotation.x += (targetRot.x - groupRef.current.rotation.x) * 0.04

    // Screen glow — responds to mouse distance + scroll
    const dist = Math.sqrt(Math.pow(mouseX - 0.5, 2) + Math.pow(mouseY - 0.5, 2))
    const mouseGlow = 0.3 + (1 - dist * 1.8) * 0.3
    const scrollGlow = scrollProgress > 0.4
      ? ((scrollProgress - 0.4) / 0.2) * 4.0
      : 0
    screenMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      screenMatRef.current.emissiveIntensity,
      Math.max(0, mouseGlow + scrollGlow),
      0.05
    )
  })

  const metalMat = {
    roughness: 0.04,
    metalness: 0.96,
    envMapIntensity: 1.8,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  }

  return (
    <group ref={groupRef}>

      {/* BODY */}
      <mesh castShadow>
        <boxGeometry args={[3.2, 1.9, 0.065]} />
        <meshPhysicalMaterial color="#b2bac4" {...metalMat} />
      </mesh>

      {/* BEZEL */}
      <mesh position={[0, 0.04, 0.034]}>
        <boxGeometry args={[3.05, 1.76, 0.005]} />
        <meshPhysicalMaterial color="#080810" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* SCREEN — RenderTexture with live UI */}
      <mesh position={[0, 0.04, 0.037]}>
        <boxGeometry args={[2.92, 1.65, 0.001]} />
        <meshStandardMaterial
          ref={screenMatRef}
          emissive="#1a3a6e"
          emissiveIntensity={0.3}
        >
          <RenderTexture attach="map" width={1024} height={600}>
            <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={50} />
            <ScreenContent />
          </RenderTexture>
        </meshStandardMaterial>
      </mesh>

      {/* CHIN */}
      <mesh position={[0, -0.88, 0.032]}>
        <boxGeometry args={[3.2, 0.16, 0.065]} />
        <meshPhysicalMaterial color="#b2bac4" {...metalMat} />
      </mesh>

      {/* STAND ROD */}
      <mesh position={[0, -1.18, -0.12]}>
        <boxGeometry args={[0.1, 0.52, 0.08]} />
        <meshPhysicalMaterial color="#8a9099" roughness={0.12} metalness={0.88} envMapIntensity={1.2} />
      </mesh>

      {/* STAND BASE */}
      <mesh position={[0, -1.42, -0.15]}>
        <boxGeometry args={[0.85, 0.035, 0.38]} />
        <meshPhysicalMaterial color="#8a9099" roughness={0.12} metalness={0.88} envMapIntensity={1.2} />
      </mesh>

    </group>
  )
}

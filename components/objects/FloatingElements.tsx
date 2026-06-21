'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// TypeSample — large "Aa" text element
const TypeSample = () => (
  <group>
    <Text font="/fonts/Heebo.ttf" fontSize={0.5} color="#f0f4ff" anchorX="center" anchorY="middle">
      {'א'}
    </Text>
    <Text
      font="/fonts/SpaceGrotesk.ttf"
      fontSize={0.28}
      color="#7a9abf"
      anchorX="center"
      anchorY="middle"
      position={[0.4, -0.1, 0]}
    >
      {'Aa'}
    </Text>
  </group>
)

// WireframeCard — thin blue rectangle
const WireframeCard = () => (
  <mesh>
    <boxGeometry args={[1.2, 0.75, 0.01]} />
    <meshBasicMaterial color="#4a9eff" wireframe />
  </mesh>
)

// ColorPalette — 5 circles
const paletteColors = ['#020408', '#0d3b6e', '#1a6bbd', '#4a9eff', '#f0f4ff']
const ColorPalette = () => (
  <group>
    {paletteColors.map((color, i) => (
      <mesh key={i} position={[i * 0.28 - 0.56, 0, 0]}>
        <circleGeometry args={[0.11, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    ))}
  </group>
)

// HebrewText — brand keywords
const HebrewText = () => (
  <Text
    font="/fonts/Heebo.ttf"
    fontSize={0.14}
    color="#7a9abf"
    letterSpacing={0.1}
    anchorX="center"
    anchorY="middle"
  >
    {'עיצוב · מיתוג · תנועה'}
  </Text>
)

// Element config: position, depth factor for parallax, Z layer
const ELEMENTS = [
  { id: 'type',    pos: [-2.2,  1.3, -1.5] as [number, number, number], depthFactor: 1.0 },
  { id: 'wire',    pos: [ 2.3, -0.2, -1.0] as [number, number, number], depthFactor: 0.7 },
  { id: 'palette', pos: [-2.8, -0.9, -0.5] as [number, number, number], depthFactor: 0.4 },
  { id: 'hebrew',  pos: [ 0.5,  1.8, -2.0] as [number, number, number], depthFactor: 1.2 },
]

type ElementId = 'type' | 'wire' | 'palette' | 'hebrew'

function FloatingElement({
  id,
  basePos,
  depthFactor,
  mouseX,
  mouseY,
  index,
}: {
  id: ElementId
  basePos: [number, number, number]
  depthFactor: number
  mouseX: number
  mouseY: number
  index: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return

    // Mouse parallax — deeper elements move more
    const tx = (mouseX - 0.5) * depthFactor * 2.0
    const ty = (mouseY - 0.5) * depthFactor * -1.5
    ref.current.position.x += (basePos[0] + tx - ref.current.position.x) * 0.03
    ref.current.position.y += (basePos[1] + ty - ref.current.position.y) * 0.03

    // Ambient slow rotation
    ref.current.rotation.y += 0.003 * (index % 2 === 0 ? 1 : -1)

    // Gentle vertical float
    ref.current.position.y += Math.sin(clock.elapsedTime * 0.3 + index) * 0.0003
  })

  return (
    <group ref={ref} position={basePos}>
      {id === 'type'    && <TypeSample />}
      {id === 'wire'    && <WireframeCard />}
      {id === 'palette' && <ColorPalette />}
      {id === 'hebrew'  && <HebrewText />}
    </group>
  )
}

export interface FloatingElementsProps {
  mouseX: number
  mouseY: number
  visible: boolean
}

export const FloatingElements = ({ mouseX, mouseY, visible }: FloatingElementsProps) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.visible = visible
  })

  return (
    <group ref={groupRef}>
      {ELEMENTS.map((el, i) => (
        <FloatingElement
          key={el.id}
          id={el.id as ElementId}
          basePos={el.pos}
          depthFactor={el.depthFactor}
          mouseX={mouseX}
          mouseY={mouseY}
          index={i}
        />
      ))}
    </group>
  )
}

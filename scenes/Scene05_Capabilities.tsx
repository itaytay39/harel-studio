'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { ParticleField } from '../components/objects/ParticleField'
import { CapabilityCard } from '../components/objects/CapabilityCard'

const CAPABILITIES = [
  { he: 'פיתוח אתרים',    en: 'Web Development',  icon: '⟨⟩', pos: [-2.2,  0.5, 0] as [number, number, number] },
  { he: 'מיתוג ויזואלי',  en: 'Brand Identity',   icon: '◈',  pos: [-0.6,  0.5, 0] as [number, number, number] },
  { he: 'עיצוב UI/UX',   en: 'UI/UX Design',     icon: '⊹',  pos: [ 0.6, -0.5, 0] as [number, number, number] },
  { he: 'תנועה ואנימציה', en: 'Motion Design',    icon: '◎',  pos: [ 2.2, -0.5, 0] as [number, number, number] },
]

interface Scene05Props {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export const Scene05_Capabilities = ({ scrollProgress, mouseX, mouseY }: Scene05Props) => {
  const sceneVisible = scrollProgress >= 0.73 && scrollProgress <= 0.92
  const groupRef = useRef<THREE.Group>(null)
  const [animated, setAnimated] = useState(false)

  useGSAP(() => {
    if (!sceneVisible || animated || !groupRef.current) return
    setAnimated(true)
    const cards = groupRef.current.children
    gsap.from(cards, {
      'position.y': -2,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.1,
    })
  }, [sceneVisible])

  return (
    <group visible={sceneVisible}>
      <ParticleField
        mouseX={mouseX}
        mouseY={mouseY}
        scrollProgress={scrollProgress}
      />

      <group ref={groupRef}>
        {CAPABILITIES.map((cap, i) => (
          <CapabilityCard
            key={i}
            heTitle={cap.he}
            enTitle={cap.en}
            icon={cap.icon}
            position={cap.pos}
            mouseX={mouseX}
            mouseY={mouseY}
            index={i}
          />
        ))}
      </group>
    </group>
  )
}

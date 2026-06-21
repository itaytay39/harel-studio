'use client'
import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Cursor } from '../components/Cursor'
import { LoadingOverlay } from '../components/LoadingScreen'
import { ScrollIndicator } from '../components/ScrollIndicator'

const Experience = dynamic(
  () => import('../components/Experience').then((m) => ({ default: m.Experience })),
  { ssr: false }
)

function WhiteFlash() {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (p >= 0.57 && p <= 0.63) {
        setOpacity(Math.min(1, (p - 0.57) / 0.06))
      } else if (p > 0.63) {
        setOpacity(Math.max(0, 1 - (p - 0.63) / 0.05))
      } else {
        setOpacity(0)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (opacity === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'white',
        opacity,
        pointerEvents: 'none',
        zIndex: 500,
        transition: 'opacity 0.1s linear',
      }}
    />
  )
}

export default function Home() {
  return (
    <main>
      <Cursor />
      <ScrollIndicator />
      <LoadingOverlay onComplete={() => {}} />
      <div
        id="canvas-wrapper"
        style={{ position: 'fixed', inset: 0, direction: 'ltr' }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </div>
      <div id="scroll-container" style={{ height: '600vh' }} />
      <WhiteFlash />
    </main>
  )
}

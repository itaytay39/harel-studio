'use client'
import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Cursor } from '../components/Cursor'
import { LoadingOverlay } from '../components/LoadingScreen'
import { ScrollIndicator } from '../components/ScrollIndicator'
import { Marquee } from '../components/Marquee'

const Experience = dynamic(
  () => import('../components/Experience').then((m) => ({ default: m.Experience })),
  { ssr: false }
)

function WhiteFlash({ scrollProgress }: { scrollProgress: number }) {
  const p = scrollProgress
  let opacity = 0
  if (p >= 0.57 && p <= 0.63) {
    opacity = Math.min(1, (p - 0.57) / 0.06)
  } else if (p > 0.63) {
    opacity = Math.max(0, 1 - (p - 0.63) / 0.05)
  }

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

function Scene04Overlay({ scrollProgress }: { scrollProgress: number }) {
  const visible = scrollProgress >= 0.58 && scrollProgress <= 0.77
  const opacity = visible
    ? Math.min(1, (scrollProgress - 0.58) / 0.05)
    : 0

  if (opacity === 0) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: '8vw',
      opacity,
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none',
    }}>
      <span style={{
        fontFamily: 'var(--font-hebrew)',
        fontSize: '0.7rem',
        letterSpacing: '0.35em',
        color: '#7a9abf',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
        direction: 'rtl',
      }}>
        סטודיו הראל · תל אביב
      </span>
      <h2 style={{
        fontFamily: 'var(--font-hebrew)',
        fontSize: 'clamp(3rem, 8vw, 7rem)',
        fontWeight: 800,
        lineHeight: 0.95,
        color: '#f0f4ff',
        direction: 'rtl',
        marginBottom: '1.5rem',
      }}>
        עיצוב שמספר<br />סיפור
      </h2>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        fontWeight: 300,
        color: '#7a9abf',
        letterSpacing: '0.05em',
        direction: 'ltr',
      }}>
        Design that tells a story
      </p>
    </div>
  )
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setScrollProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      <WhiteFlash scrollProgress={scrollProgress} />
      <Scene04Overlay scrollProgress={scrollProgress} />
      <Marquee />
    </main>
  )
}

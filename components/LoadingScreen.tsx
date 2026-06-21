'use client'
import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

export const LoadingOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const { progress } = useProgress()
  const [gone, setGone] = useState(false)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (progress < 100) return
    const t1 = setTimeout(() => setOpacity(0), 300)
    const t2 = setTimeout(() => { setGone(true); onComplete() }, 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [progress, onComplete])

  if (gone) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: '#020408',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity,
      transition: 'opacity 0.6s ease',
      pointerEvents: opacity === 0 ? 'none' : 'all',
    }}>

      {/* Studio name */}
      <div style={{
        fontFamily: 'var(--font-hebrew)',
        fontSize: '0.85rem',
        letterSpacing: '0.45em',
        color: '#7a9abf',
        marginBottom: '2.5rem',
        direction: 'rtl',
      }}>
        סטודיו הראל
      </div>

      {/* Progress bar track */}
      <div style={{
        width: 180,
        height: 1,
        background: 'rgba(74,158,255,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Progress bar fill */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#4a9eff',
          transform: `scaleX(${progress / 100})`,
          transformOrigin: 'left',
          transition: 'transform 0.25s ease',
        }} />
      </div>

      {/* Percentage */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.65rem',
        color: '#4a9eff',
        letterSpacing: '0.2em',
        marginTop: '0.9rem',
      }}>
        {Math.round(progress)}%
      </div>

    </div>
  )
}

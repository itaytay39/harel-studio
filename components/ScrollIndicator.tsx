'use client'
import { useEffect, useState } from 'react'

export const ScrollIndicator = () => {
  const [visible, setVisible] = useState(true)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const onScroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (progress > 0.04) {
        setOpacity(0)
        setTimeout(() => setVisible(false), 400)
      } else {
        setVisible(true)
        setOpacity(1)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '2.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      opacity,
      transition: 'opacity 0.4s ease',
      pointerEvents: 'none',
      fontFamily: 'var(--font-hebrew)',
      fontSize: '0.75rem',
      letterSpacing: '0.2em',
      color: 'rgba(240,244,255,0.5)',
      animation: 'bounce 1.6s ease-in-out infinite',
    }}>
      גלול למטה ↓
    </div>
  )
}

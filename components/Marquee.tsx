'use client'
import { useEffect, useState } from 'react'

const ITEMS = [
  'סטודיו הראל', 'HAREL STUDIO',
  'עיצוב', 'DESIGN',
  'מיתוג', 'BRANDING',
  'תנועה', 'MOTION',
  'חוויית משתמש', 'UX/UI',
  'אתרים', 'WEB',
  'זהות ויזואלית', 'IDENTITY',
]

export const Marquee = () => {
  const [visible, setVisible] = useState(false)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (p >= 0.55) {
        setVisible(true)
        setOpacity(Math.min(1, (p - 0.55) / 0.05))
      } else {
        setOpacity(0)
        if (opacity === 0) setVisible(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [opacity])

  if (!visible) return null

  const items = [...ITEMS, ...ITEMS] // Double for seamless loop

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 40,
        background: '#0d3b6e',
        overflow: 'hidden',
        zIndex: 200,
        opacity,
        transition: 'opacity 0.4s ease',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          animation: 'marquee 24s linear infinite',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontSize: '0.8rem',
              color: '#4a9eff',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '0 1.5rem',
              direction: 'ltr',
            }}
          >
            {item}
            <span style={{ marginLeft: '1.5rem', opacity: 0.4 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

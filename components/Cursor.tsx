'use client'
import { useEffect, useRef } from 'react'

export const Cursor = () => {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let dotX = 0, dotY = 0, ringX = 0, ringY = 0
    let hovering = false
    let raf: number

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX
      dotY = e.clientY
    }

    const onEnter = () => { hovering = true }
    const onLeave = () => { hovering = false }

    const attachHover = (el: Element) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    }

    document.querySelectorAll('a, button, [data-hover]').forEach(attachHover)
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`
      }

      ringX += (dotX - ringX) * 0.12
      ringY += (dotY - ringY) * 0.12

      if (ringRef.current) {
        const s = hovering ? 52 : 36
        ringRef.current.style.transform = `translate(${ringX - s / 2}px, ${ringY - s / 2}px)`
        ringRef.current.style.width  = `${s}px`
        ringRef.current.style.height = `${s}px`
        ringRef.current.style.borderColor = hovering
          ? '#4a9eff'
          : 'rgba(240,244,255,0.55)'
      }

      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  const fixed: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    willChange: 'transform',
    zIndex: 9999,
  }

  return (
    <>
      {/* Dot — snaps instantly */}
      <div
        ref={dotRef}
        style={{
          ...fixed,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#f0f4ff',
        }}
      />
      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        style={{
          ...fixed,
          zIndex: 9998,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(240,244,255,0.55)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        }}
      />
    </>
  )
}

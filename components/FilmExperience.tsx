'use client'
import { useEffect, useRef, useState } from 'react'
import { CHAPTERS, TOTAL_FRAMES, framePath, type Chapter } from '../lib/chapters'

// Cinematic scroll-film player (jetliner/stoneliner technique):
// pre-rendered frame sequences drawn on a single canvas, driven by a
// virtual scroll. No WebGL. The rAF loop runs only while momentum exists,
// and every per-frame update writes straight to DOM refs — React renders
// exactly twice (loading → ready).

const WHEEL_SPEED = 0.00009
const TOUCH_SPEED = 0.00035
const DAMPING = 0.075
const MAX_DPR = 1.5
const PRELOAD_CONCURRENCY = 8

interface FlatFrame {
  chapter: Chapter
  localIndex: number
}

const FLAT_FRAMES: FlatFrame[] = CHAPTERS.flatMap((chapter) =>
  Array.from({ length: chapter.frames }, (_, localIndex) => ({ chapter, localIndex }))
)

export const FilmExperience = () => {
  const [ready, setReady] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const frameCounterRef = useRef<HTMLSpanElement>(null)
  const chapterNumRef = useRef<HTMLSpanElement>(null)
  const titleWrapRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const kickerRef = useRef<HTMLSpanElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const frames: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null)
    let current = 0
    let target = 0
    let rafId = 0
    let looping = false
    let lastDrawn = -1
    let scrolled = false
    let disposed = false

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      lastDrawn = -1
      draw(Math.round(current * (TOTAL_FRAMES - 1)))
    }

    const draw = (index: number) => {
      if (index === lastDrawn) return
      // If the exact frame isn't loaded yet (lazy chapters), fall back to the
      // nearest loaded frame behind it so the canvas never goes blank.
      let img = frames[index]
      if (!img) {
        for (let i = index; i >= 0; i--) {
          if (frames[i]) { img = frames[i]; break }
        }
      }
      if (!img) return
      lastDrawn = index
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    const updateOverlays = () => {
      // Frame counter (jetliner-style HUD)
      const index = Math.round(current * (TOTAL_FRAMES - 1))
      if (frameCounterRef.current) {
        frameCounterRef.current.textContent = `FRM ${String(index + 1).padStart(4, '0')} / ${String(TOTAL_FRAMES).padStart(4, '0')}`
      }

      // Which chapter are we in?
      const flat = FLAT_FRAMES[index]
      if (!flat) return
      const chapterIdx = CHAPTERS.indexOf(flat.chapter)
      if (chapterNumRef.current) {
        chapterNumRef.current.textContent = String(chapterIdx + 1).padStart(2, '0')
      }

      // Local progress inside the chapter → title opacity curve
      const p = flat.localIndex / (flat.chapter.frames - 1)
      let opacity = 1
      if (p < 0.06) opacity = p / 0.06
      else if (p > 0.72) opacity = Math.max(0, 1 - (p - 0.72) / 0.18)
      if (titleWrapRef.current) {
        titleWrapRef.current.style.opacity = String(opacity)
        titleWrapRef.current.style.transform = `translateY(${p * -30}px)`
      }
      if (titleRef.current && titleRef.current.textContent !== flat.chapter.title) {
        titleRef.current.textContent = flat.chapter.title
      }
      if (kickerRef.current && kickerRef.current.textContent !== flat.chapter.kicker) {
        kickerRef.current.textContent = flat.chapter.kicker
      }

      // Hide the scroll hint after first movement
      if (scrolled && scrollHintRef.current) {
        scrollHintRef.current.style.opacity = '0'
      }
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      // rAF while visible; timer fallback keeps the film alive in hidden tabs
      if (document.visibilityState === 'visible') {
        rafId = requestAnimationFrame(tick)
      } else {
        timeoutId = setTimeout(tick, 33)
      }
    }

    const tick = () => {
      current += (target - current) * DAMPING
      draw(Math.round(current * (TOTAL_FRAMES - 1)))
      updateOverlays()
      if (Math.abs(target - current) > 0.0004) {
        schedule()
      } else {
        current = target
        looping = false
      }
    }

    const kick = () => {
      if (!looping) {
        looping = true
        schedule()
      }
    }

    // Programmatic navigation — used by chapter nav (and dev verification)
    const seek = (p: number) => {
      target = Math.min(1, Math.max(0, p))
      current = target
      lastDrawn = -1
      draw(Math.round(current * (TOTAL_FRAMES - 1)))
      updateOverlays()
    }
    ;(window as unknown as Record<string, unknown>).__harelFilm = { seek }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      scrolled = true
      target = Math.min(1, Math.max(0, target + e.deltaY * WHEEL_SPEED))
      kick()
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      scrolled = true
      const y = e.touches[0].clientY
      target = Math.min(1, Math.max(0, target + (touchY - y) * TOUCH_SPEED))
      touchY = y
      kick()
    }

    // Progressive preload: chapter 1 gates the reveal; the rest stream in
    // behind it so first paint costs ~13MB, not the whole film.
    const loadRange = async (from: number, to: number, concurrency: number, onProgress?: (done: number, total: number) => void) => {
      let cursor = from
      let done = 0
      const worker = async () => {
        while (cursor < to && !disposed) {
          const i = cursor++
          const { chapter, localIndex } = FLAT_FRAMES[i]
          const img = new Image()
          // Gate on onload, not decode(): Chrome defers decode() work in
          // hidden tabs indefinitely. Kick decode opportunistically after.
          await new Promise<void>((resolve) => {
            img.onload = () => resolve()
            img.onerror = () => resolve()
            img.src = framePath(chapter, localIndex)
          })
          img.decode().catch(() => {})
          frames[i] = img
          done++
          onProgress?.(done, to - from)
          if (i === 0) {
            resize()
            draw(0)
          }
        }
      }
      await Promise.all(Array.from({ length: concurrency }, worker))
    }

    const preload = async () => {
      const gate = CHAPTERS[0].frames
      await loadRange(0, gate, PRELOAD_CONCURRENCY, (done, total) => {
        const pct = Math.round((done / total) * 100)
        if (pctRef.current) pctRef.current.textContent = `${pct}%`
        if (barRef.current) barRef.current.style.width = `${pct}%`
      })
      if (disposed) return
      draw(0)
      updateOverlays()
      setReady(true)
      // Stream the remaining chapters quietly in the background
      loadRange(gate, TOTAL_FRAMES, 4)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    resize()
    preload()

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      if (timeoutId) clearTimeout(timeoutId)
      delete (window as unknown as Record<string, unknown>).__harelFilm
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  const hudText: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: '0.62rem',
    letterSpacing: '0.28em',
    color: 'rgba(240,244,255,0.55)',
    textTransform: 'uppercase',
    direction: 'ltr',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050607', overflow: 'hidden' }}>
      {/* The film */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />

      {/* Cinematic grade: vignette + top/bottom gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.42) 100%),' +
            'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 18%, transparent 82%, rgba(0,0,0,0.45))',
        }}
      />

      {/* Chapter title */}
      <div
        ref={titleWrapRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <span
          ref={kickerRef}
          style={{
            fontFamily: 'var(--font-hebrew)',
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.55em',
            color: 'rgba(240,244,255,0.65)',
            marginBottom: '1.4rem',
            direction: 'rtl',
          }}
        />
        <h1
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-title)',
            fontWeight: 900,
            fontSize: 'clamp(4.5rem, 15vw, 12rem)',
            lineHeight: 0.95,
            color: '#f2f5ff',
            direction: 'rtl',
            margin: 0,
            textShadow: '0 4px 60px rgba(0,0,0,0.45)',
          }}
        />
      </div>

      {/* HUD — corners */}
      <div style={{ position: 'absolute', top: '1.4rem', right: '1.6rem', ...hudText, direction: 'rtl', fontFamily: 'var(--font-hebrew)', letterSpacing: '0.35em' }}>
        סטודיו הראל
      </div>
      <div style={{ position: 'absolute', top: '1.4rem', left: '1.6rem', ...hudText }}>
        32.08°N · 34.78°E — TLV
      </div>
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.6rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem', direction: 'ltr' }}>
        <span ref={chapterNumRef} style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: '#f2f5ff' }}>01</span>
        <span style={{ ...hudText }}>/ {String(CHAPTERS.length).padStart(2, '0')}</span>
      </div>
      <div style={{ position: 'absolute', bottom: '1.7rem', right: '1.6rem', ...hudText }}>
        <span ref={frameCounterRef}>FRM 0001 / {String(TOTAL_FRAMES).padStart(4, '0')}</span>
      </div>

      {/* Corner brackets */}
      {([
        { top: '1rem', left: '1rem', borderTop: '1px solid', borderLeft: '1px solid' },
        { top: '1rem', right: '1rem', borderTop: '1px solid', borderRight: '1px solid' },
        { bottom: '1rem', left: '1rem', borderBottom: '1px solid', borderLeft: '1px solid' },
        { bottom: '1rem', right: '1rem', borderBottom: '1px solid', borderRight: '1px solid' },
      ] as React.CSSProperties[]).map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 18,
            height: 18,
            color: 'rgba(240,244,255,0.25)',
            pointerEvents: 'none',
            ...pos,
          }}
        />
      ))}

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: 'absolute',
          bottom: '1.6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-hebrew)',
          fontSize: '0.68rem',
          letterSpacing: '0.45em',
          color: 'rgba(240,244,255,0.5)',
          direction: 'rtl',
          transition: 'opacity 0.8s ease',
          opacity: ready ? 1 : 0,
          animation: ready ? 'bounce 2.4s ease-in-out infinite' : 'none',
        }}
      >
        גלול ↓
      </div>

      {/* Preloader */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#050607',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.6rem',
          zIndex: 20,
          opacity: ready ? 0 : 1,
          pointerEvents: ready ? 'none' : 'auto',
          transition: 'opacity 0.9s ease 0.25s',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-hebrew)',
            fontSize: '0.8rem',
            fontWeight: 500,
            letterSpacing: '0.6em',
            color: '#f2f5ff',
            direction: 'rtl',
          }}
        >
          סטודיו הראל
        </span>
        <div style={{ width: 220, height: 1, background: 'rgba(240,244,255,0.15)' }}>
          <div ref={barRef} style={{ width: '0%', height: '100%', background: '#f2f5ff', transition: 'width 0.2s ease' }} />
        </div>
        <span ref={pctRef} style={{ ...hudText, fontSize: '0.58rem' }}>0%</span>
      </div>
    </div>
  )
}

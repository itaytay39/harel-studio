import { useState, useEffect } from 'react'

export const useMouseParallax = () => {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return mouse
}

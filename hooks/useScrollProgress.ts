import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setProgress(self.progress),
    })
    return () => st.kill()
  }, [])

  return progress
}

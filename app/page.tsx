'use client'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Cursor } from '../components/Cursor'
import { LoadingOverlay } from '../components/LoadingScreen'
import { ScrollIndicator } from '../components/ScrollIndicator'

const Experience = dynamic(
  () => import('../components/Experience').then((m) => ({ default: m.Experience })),
  { ssr: false }
)

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
    </main>
  )
}

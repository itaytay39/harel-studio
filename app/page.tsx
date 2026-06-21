'use client'

export default function Home() {
  return (
    <main>
      {/* Canvas wrapper — Three.js will render here */}
      <div id="canvas-wrapper" />

      {/* Scroll container — creates 600vh scroll space */}
      <div id="scroll-container" />
    </main>
  )
}

import type { Metadata } from 'next'
import { Space_Grotesk, Heebo, Noto_Sans_Hebrew } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-hebrew',
  weight: ['300', '400', '500', '700', '800'],
})

// Ultra-heavy Hebrew display face for the chapter titles
const notoHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  variable: '--font-title',
  weight: ['800', '900'],
})

export const metadata: Metadata = {
  title: 'סטודיו הראל — עיצוב שמספר סיפור',
  description: 'Harel Studio — Cinematic Design Experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${spaceGrotesk.variable} ${notoHebrew.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}

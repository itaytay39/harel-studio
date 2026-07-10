// Film chapters. Adding a chapter = drop frames into public/seq/<id>/ and add a row here.
export interface Chapter {
  id: string
  dir: string
  frames: number
  title: string
  kicker: string
}

export const CHAPTERS: Chapter[] = [
  { id: 'ch01', dir: '/seq/ch01', frames: 121, title: 'הַתְחָלָה', kicker: 'פרק ראשון' },
  { id: 'ch02', dir: '/seq/ch02', frames: 121, title: 'רַעְיוֹן', kicker: 'פרק שני' },
  { id: 'ch03', dir: '/seq/ch03', frames: 121, title: 'תְּנוּעָה', kicker: 'פרק שלישי' },
  { id: 'ch04', dir: '/seq/ch04', frames: 121, title: 'מוֹתָג', kicker: 'פרק רביעי' },
  { id: 'ch05', dir: '/seq/ch05', frames: 121, title: 'סִיפּוּר', kicker: 'פרק חמישי' },
]

export const TOTAL_FRAMES = CHAPTERS.reduce((sum, c) => sum + c.frames, 0)

export const framePath = (chapter: Chapter, i: number) =>
  `${chapter.dir}/f_${String(i + 1).padStart(4, '0')}.jpg`

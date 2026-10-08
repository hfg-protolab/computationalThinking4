// Each variant has its own set of colors; the keys are stored in the board state, the values are Tailwind classes.
export const STICKY_NOTE_COLORS = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  green: 'bg-green-200',
} as const

export const CIRCLE_COLORS = {
  blue: 'bg-sky-200',
  purple: 'bg-violet-200',
  orange: 'bg-orange-200',
} as const

export type StickyNoteColor = keyof typeof STICKY_NOTE_COLORS
export type CircleColor = keyof typeof CIRCLE_COLORS

export const FONT_SIZES = { S: 14, M: 18, L: 24, XL: 32 } as const

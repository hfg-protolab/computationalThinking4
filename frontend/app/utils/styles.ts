import type { BorderWidth, FontSize } from '~/models/attributes'

export const NOTE_COLORS = ['#fef08a', '#fbcfe8', '#bae6fd', '#bbf7d0']
export const CIRCLE_COLORS = ['#f87171', '#60a5fa', '#4ade80']
export const COLORS = [...NOTE_COLORS, ...CIRCLE_COLORS]

export const FONT_SIZE_CLASSES: Record<FontSize, string> = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }

export const BORDER_CLASSES: Record<BorderWidth, string> = {
  none: '',
  thin: 'border-2 border-black/50',
  thick: 'border-4 border-black/50',
}

export function textClasses(fontSize: FontSize, bold: boolean) {
  return `${FONT_SIZE_CLASSES[fontSize]} ${bold ? 'font-bold' : ''}`
}

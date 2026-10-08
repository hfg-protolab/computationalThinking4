import type { CircleColor, StickyNoteColor } from '~/utils/palette'

// Base: what every object on the canvas has in common.
export interface CanvasObject {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
}

// Intermediate level: a canvas object that also shows styled text.
export interface TextObject extends CanvasObject {
  text: string
  fontSize: number
  bold: boolean
}

// Variants: extend TextObject with their own type and, if they have one, a color.
export interface StickyNoteObject extends TextObject {
  type: 'sticky-note'
  color: StickyNoteColor
}

export interface PlainTextObject extends TextObject {
  type: 'text'
}

// A variant can also extend the base directly: a circle has a color but no text.
export interface CircleObject extends CanvasObject {
  type: 'circle'
  color: CircleColor
}

export type BoardObject = StickyNoteObject | PlainTextObject | CircleObject

// What the toolbar picks: the variant and, if it has one, its color.
export type ObjectTemplate =
  | Pick<StickyNoteObject, 'type' | 'color'>
  | Pick<PlainTextObject, 'type'>
  | Pick<CircleObject, 'type' | 'color'>

// What the context bar can change on the selected object.
export type StyleChanges = Partial<Pick<TextObject, 'fontSize' | 'bold'>> & { color?: string }

export type Rect = Pick<CanvasObject, 'x' | 'y' | 'width' | 'height'>

export type Corner = 'nw' | 'ne' | 'sw' | 'se'
export type GestureMode = 'move' | Corner

// Events every variant component emits, so the board can treat them all the same.
export interface CanvasObjectEmits {
  grab: [event: PointerEvent, mode: GestureMode]
  edit: []
  editEnd: []
  text: [text: string]
  resize: [rect: Rect]
}

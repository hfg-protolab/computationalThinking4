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

// Variants: extend TextObject with their own type and their own color palette.
export interface StickyNoteObject extends TextObject {
  type: 'sticky-note'
  color: StickyNoteColor
}

export interface CircleObject extends TextObject {
  type: 'circle'
  color: CircleColor
}

export type BoardObject = StickyNoteObject | CircleObject

// What the toolbar picks: the variant and its variant-specific color.
export type ObjectTemplate = Pick<StickyNoteObject, 'type' | 'color'> | Pick<CircleObject, 'type' | 'color'>

// What the context bar can change on the selected object.
export type StyleChanges = Partial<Pick<TextObject, 'fontSize' | 'bold'>> & { color?: StickyNoteColor | CircleColor }

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

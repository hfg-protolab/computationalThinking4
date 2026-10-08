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

// Variants: extend the base with their own type and attributes.
export interface StickyNoteObject extends CanvasObject {
  type: 'sticky-note'
  text: string
  color: StickyNoteColor
}

export interface CircleObject extends CanvasObject {
  type: 'circle'
  text: string
  color: CircleColor
}

export type BoardObject = StickyNoteObject | CircleObject

// What the toolbar picks: the variant and its variant-specific color.
export type ObjectTemplate = Pick<StickyNoteObject, 'type' | 'color'> | Pick<CircleObject, 'type' | 'color'>

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

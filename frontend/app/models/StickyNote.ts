import type { FontSize, StyleAttributes } from './attributes'
import { BoardItem, type Rect } from './BoardItem'

export class StickyNote extends BoardItem implements Pick<StyleAttributes, 'color' | 'fontSize' | 'bold'> {
  color: string
  text: string
  fontSize: FontSize = 'md'
  bold = false

  constructor(rect: Rect, color: string, text = '') {
    super(rect)
    this.color = color
    this.text = text
  }
}

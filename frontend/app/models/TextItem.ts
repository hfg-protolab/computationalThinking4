import type { FontSize, StyleAttributes } from './attributes'
import { BoardItem, type Rect } from './BoardItem'

export class TextItem extends BoardItem implements Pick<StyleAttributes, 'fontSize' | 'bold'> {
  text: string
  fontSize: FontSize = 'md'
  bold = false

  constructor(rect: Rect, text = '') {
    super(rect)
    this.text = text
  }
}

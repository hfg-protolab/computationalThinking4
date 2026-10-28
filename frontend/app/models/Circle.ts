import { snapToGrid } from '~/utils/grid'
import type { BorderWidth, StyleAttributes } from './attributes'
import { BoardItem, MIN_SIZE, type Rect } from './BoardItem'

export class Circle extends BoardItem implements Pick<StyleAttributes, 'color' | 'border'> {
  color: string
  border: BorderWidth = 'none'

  constructor(rect: Rect, color: string) {
    super(rect)
    this.color = color
  }

  // A circle stays round, so width and height always match.
  override sizeFor(width: number, height: number) {
    const size = Math.max(MIN_SIZE, snapToGrid(Math.max(width, height)))
    return { width: size, height: size }
  }
}

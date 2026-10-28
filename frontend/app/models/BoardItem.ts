import { GRID_SIZE, snapToGrid } from '~/utils/grid'

export type Corner = 'nw' | 'ne' | 'sw' | 'se'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export const MIN_SIZE = GRID_SIZE * 3

// Base class for everything that can be placed, moved and resized on the board.
export abstract class BoardItem implements Rect {
  readonly id = crypto.randomUUID()
  x: number
  y: number
  width: number
  height: number

  constructor(rect: Rect) {
    this.x = rect.x
    this.y = rect.y
    this.width = rect.width
    this.height = rect.height
  }

  // Creates an independent copy of the same class with its own id, e.g. for copy & paste.
  clone(): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this, { id: crypto.randomUUID() })
  }

  moveTo(x: number, y: number) {
    this.x = snapToGrid(x)
    this.y = snapToGrid(y)
  }

  // Resizing from a north or west corner moves the item so the opposite corner stays put.
  resizeFrom(corner: Corner, start: Rect, dx: number, dy: number) {
    const { width, height } = this.sizeFor(
      start.width + (corner.endsWith('e') ? dx : -dx),
      start.height + (corner.startsWith('s') ? dy : -dy),
    )
    this.width = width
    this.height = height
    this.x = corner.endsWith('w') ? start.x + start.width - width : start.x
    this.y = corner.startsWith('n') ? start.y + start.height - height : start.y
  }

  // Grows the item to the next grid line when its content no longer fits.
  growToFit(contentHeight: number) {
    const needed = Math.ceil(contentHeight / GRID_SIZE) * GRID_SIZE
    if (needed > this.height) this.height = needed
  }

  sizeFor(width: number, height: number) {
    return {
      width: Math.max(MIN_SIZE, snapToGrid(width)),
      height: Math.max(MIN_SIZE, snapToGrid(height)),
    }
  }
}

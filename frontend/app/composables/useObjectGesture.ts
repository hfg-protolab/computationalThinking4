import type { BoardObject, Corner, GestureMode, Rect } from '~/types/canvas-object'

// Resizing from a north or west corner moves the object so the opposite corner stays put.
function resizedRect(corner: Corner, start: Rect, dx: number, dy: number, keepSquare: boolean): Rect {
  let width = Math.max(MIN_OBJECT_SIZE, snapToGrid(start.width + (corner.endsWith('e') ? dx : -dx)))
  let height = Math.max(MIN_OBJECT_SIZE, snapToGrid(start.height + (corner.startsWith('s') ? dy : -dy)))
  if (keepSquare) width = height = Math.max(width, height)
  return {
    width,
    height,
    x: corner.endsWith('w') ? start.x + start.width - width : start.x,
    y: corner.startsWith('n') ? start.y + start.height - height : start.y,
  }
}

// Turns pointer movement into board state changes while an object is dragged or resized.
export function useObjectGesture(scale: Ref<number>) {
  const { moveObject, resizeObject } = useBoard()

  function start(event: PointerEvent, object: BoardObject, mode: GestureMode) {
    const startX = event.clientX
    const startY = event.clientY
    const origin = { ...object }
    const keepSquare = object.type === 'circle'

    function onPointerMove(moveEvent: PointerEvent) {
      const dx = (moveEvent.clientX - startX) / scale.value
      const dy = (moveEvent.clientY - startY) / scale.value
      if (mode === 'move') moveObject(object.id, snapToGrid(origin.x + dx), snapToGrid(origin.y + dy))
      else resizeObject(object.id, resizedRect(mode, origin, dx, dy, keepSquare))
    }

    function onPointerUp() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  return { start }
}

import type { Note, Rect } from '~/types/note'

export type Corner = 'nw' | 'ne' | 'sw' | 'se'
export type GestureMode = 'move' | Corner

// Resizing from a north or west corner moves the note so the opposite corner stays put.
function resizedRect(corner: Corner, start: Rect, dx: number, dy: number): Rect {
  const width = Math.max(MIN_NOTE_SIZE, snapToGrid(start.width + (corner.endsWith('e') ? dx : -dx)))
  const height = Math.max(MIN_NOTE_SIZE, snapToGrid(start.height + (corner.startsWith('s') ? dy : -dy)))
  return {
    width,
    height,
    x: corner.endsWith('w') ? start.x + start.width - width : start.x,
    y: corner.startsWith('n') ? start.y + start.height - height : start.y,
  }
}

// Turns pointer movement into board state changes while a note is dragged or resized.
export function useNoteGesture(scale: Ref<number>) {
  const { moveNote, resizeNote } = useBoard()

  function start(event: PointerEvent, note: Note, mode: GestureMode) {
    const startX = event.clientX
    const startY = event.clientY
    const origin = { ...note }

    function onPointerMove(moveEvent: PointerEvent) {
      const dx = (moveEvent.clientX - startX) / scale.value
      const dy = (moveEvent.clientY - startY) / scale.value
      if (mode === 'move') moveNote(note.id, snapToGrid(origin.x + dx), snapToGrid(origin.y + dy))
      else resizeNote(note.id, resizedRect(mode, origin, dx, dy))
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

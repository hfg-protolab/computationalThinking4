import type { BoardObject, Rect } from '~/types/canvas-object'

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [
    { id: 'note-1', type: 'sticky-note', x: 120, y: 120, width: 192, height: 192, text: 'Hello, board!' },
    { id: 'note-2', type: 'sticky-note', x: 360, y: 120, width: 192, height: 192, text: 'Drag me around' },
    { id: 'circle-1', type: 'circle', x: 600, y: 120, width: 192, height: 192, text: 'Circles work too' },
  ])

  function updateObject(id: string, changes: Partial<Rect> & { text?: string }) {
    objects.value = objects.value.map(object => (object.id === id ? { ...object, ...changes } : object))
  }

  function moveObject(id: string, x: number, y: number) {
    updateObject(id, { x, y })
  }

  function resizeObject(id: string, rect: Rect) {
    updateObject(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
  }

  return { objects: readonly(objects), moveObject, resizeObject, updateText }
}

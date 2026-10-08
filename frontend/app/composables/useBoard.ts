import type { BoardObject, ObjectTemplate, Rect, StyleChanges } from '~/types/canvas-object'

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [
    { id: 'note-1', type: 'sticky-note', x: 120, y: 120, width: 192, height: 192, text: 'Hello, board!', color: 'yellow', fontSize: FONT_SIZES.M, bold: false },
    { id: 'note-2', type: 'sticky-note', x: 360, y: 120, width: 192, height: 192, text: 'Drag me around', color: 'pink', fontSize: FONT_SIZES.M, bold: false },
    { id: 'circle-1', type: 'circle', x: 600, y: 120, width: 192, height: 192, text: 'Circles work too', color: 'blue', fontSize: FONT_SIZES.M, bold: false },
  ])

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const size = GRID_SIZE * 8
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - size / 2)
    const y = snapToGrid(centerY - size / 2)
    objects.value = [...objects.value, { ...template, id, x, y, width: size, height: size, text: '', fontSize: FONT_SIZES.M, bold: false }]
    return id
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    const id = crypto.randomUUID()
    objects.value = [...objects.value, { ...source, id }]
    return id
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
  }

  function updateObject(id: string, changes: Partial<Rect> & StyleChanges & { text?: string }) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
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

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
  }

  return { objects: readonly(objects), addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}

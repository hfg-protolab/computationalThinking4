import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [
    { id: 'note-1', type: 'sticky-note', x: 120, y: 120, width: 192, height: 192, text: 'Hello, board!', color: 'yellow', fontSize: FONT_SIZES.M, bold: false },
    { id: 'note-2', type: 'sticky-note', x: 360, y: 120, width: 192, height: 192, text: 'Drag me around', color: 'pink', fontSize: FONT_SIZES.M, bold: false },
    { id: 'text-1', type: 'text', x: 600, y: 120, width: 240, height: 72, text: 'Just some text', fontSize: FONT_SIZES.M, bold: false },
    { id: 'circle-1', type: 'circle', x: 600, y: 240, width: 144, height: 144, color: 'blue' },
  ])

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    objects.value = [...objects.value, { ...defaults, ...template, id, x, y } as BoardObject]
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

import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

type ObjectChanges = Partial<Rect> & StyleChanges & { text?: string }

// Changes are sent to the backend after a short pause, so dragging or typing
// does not send one request per pixel or letter.
const SAVE_DELAY = 300
const pendingChanges = new Map<string, { changes: ObjectChanges; timer: ReturnType<typeof setTimeout> }>()

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below,
// which update the state right away and then tell the backend.
export function useBoard() {
  const api = $fetch.create({ baseURL: useRuntimeConfig().public.apiBase })
  const boardId = useState<string | null>('boardId', () => null)
  const objects = useState<BoardObject[]>('objects', () => [])

  // Opens a board: new objects are created on it from now on.
  async function load(id: string) {
    boardId.value = id
    objects.value = await api<BoardObject[]>(`/boards/${id}/objects`)
  }

  function insert(object: BoardObject) {
    objects.value = [...objects.value, object]
    api(`/boards/${boardId.value}/objects`, { method: 'POST', body: object })
  }

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    insert({ ...defaults, ...template, id, x, y } as BoardObject)
    return id
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    const id = crypto.randomUUID()
    insert({ ...source, id })
    return id
  }

  function removeObject(id: string) {
    clearTimeout(pendingChanges.get(id)?.timer)
    pendingChanges.delete(id)
    objects.value = objects.value.filter(object => object.id !== id)
    api(`/objects/${id}`, { method: 'DELETE' })
  }

  function updateObject(id: string, changes: ObjectChanges) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
    scheduleSave(id, changes)
  }

  // Collects the changes per object and sends them together once nothing changed for SAVE_DELAY.
  function scheduleSave(id: string, changes: ObjectChanges) {
    const pending = pendingChanges.get(id)
    clearTimeout(pending?.timer)
    const merged = { ...pending?.changes, ...changes }
    const timer = setTimeout(() => {
      pendingChanges.delete(id)
      api(`/objects/${id}`, { method: 'PATCH', body: merged })
    }, SAVE_DELAY)
    pendingChanges.set(id, { changes: merged, timer })
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

  return { objects: readonly(objects), load, addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}

import type { BoardObject } from '~/types/canvas-object'

interface Shortcut {
  // 'mod' means Cmd on macOS and Ctrl elsewhere, e.g. 'mod+c'.
  keys: string[]
  run: (selected?: BoardObject) => void
}

// Keyboard shortcuts for canvas objects. They only use the base attributes,
// so they work for every variant.
export function useShortcuts(selectedId: Ref<string | null>, editingId: Ref<string | null>) {
  const { objects, addCopy, removeObject, moveObject } = useBoard()
  let clipboard: BoardObject | null = null

  const shortcuts: Shortcut[] = [
    { keys: ['mod+c'], run: copy },
    { keys: ['mod+x'], run: cut },
    { keys: ['mod+v'], run: paste },
    { keys: ['mod+d'], run: duplicate },
    { keys: ['Delete', 'Backspace'], run: remove },
    { keys: ['Escape'], run: deselect },
    { keys: ['ArrowLeft'], run: object => nudge(object, -1, 0) },
    { keys: ['ArrowRight'], run: object => nudge(object, 1, 0) },
    { keys: ['ArrowUp'], run: object => nudge(object, 0, -1) },
    { keys: ['ArrowDown'], run: object => nudge(object, 0, 1) },
  ]

  function copy(object?: BoardObject) {
    if (object) clipboard = { ...object }
  }

  function cut(object?: BoardObject) {
    copy(object)
    remove(object)
  }

  function paste() {
    if (clipboard) clipboard = placeCopy(clipboard)
  }

  function duplicate(object?: BoardObject) {
    if (object) placeCopy(object)
  }

  function remove(object?: BoardObject) {
    if (!object) return
    removeObject(object.id)
    deselect()
  }

  function deselect() {
    selectedId.value = null
  }

  function nudge(object: BoardObject | undefined, stepX: number, stepY: number) {
    if (object) moveObject(object.id, object.x + stepX * GRID_SIZE, object.y + stepY * GRID_SIZE)
  }

  // Copies land one grid step down and to the right of their source and become selected.
  function placeCopy(source: BoardObject) {
    const copy = { ...source, x: source.x + GRID_SIZE, y: source.y + GRID_SIZE }
    selectedId.value = addCopy(copy)
    return copy
  }

  function matches(combo: string, event: KeyboardEvent) {
    const parts = combo.split('+')
    const key = parts.pop()!
    const wantsMod = parts.includes('mod')
    return wantsMod === (event.metaKey || event.ctrlKey) && key.toLowerCase() === event.key.toLowerCase()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (editingId.value || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
    const shortcut = shortcuts.find(({ keys }) => keys.some(combo => matches(combo, event)))
    if (!shortcut) return
    event.preventDefault()
    shortcut.run(objects.value.find(object => object.id === selectedId.value))
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
}

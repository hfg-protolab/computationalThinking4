import type { BoardItem } from '~/models/BoardItem'

interface Shortcut {
  keys: string
  description: string
  matches: (event: KeyboardEvent) => boolean
  run: (event: KeyboardEvent) => void
}

const ARROWS: Record<string, [columns: number, rows: number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

// ⌘ on macOS, Ctrl on Windows and Linux.
const command = (key: string) => (event: KeyboardEvent) =>
  (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key

const plain = (...keys: string[]) => (event: KeyboardEvent) =>
  !event.metaKey && !event.ctrlKey && keys.includes(event.key)

export function useShortcuts(selectedId: Ref<string | null>) {
  const board = useBoard()
  // The clipboard belongs to this browser tab only, so it stays local like the selection.
  let clipboard: BoardItem | null = null

  function withSelection(action: (id: string, event: KeyboardEvent) => void) {
    return (event: KeyboardEvent) => {
      if (selectedId.value) action(selectedId.value, event)
    }
  }

  function paste() {
    if (!clipboard) return
    selectedId.value = board.addCopy(clipboard)
    // The next paste lands one grid cell further, so copies don't stack exactly.
    clipboard = board.copyItem(selectedId.value)
  }

  const shortcuts: Shortcut[] = [
    { keys: '⌘C', description: 'Kopieren', matches: command('c'), run: withSelection((id) => {
      clipboard = board.copyItem(id)
    }) },
    { keys: '⌘X', description: 'Ausschneiden', matches: command('x'), run: withSelection((id) => {
      clipboard = board.copyItem(id)
      board.removeItem(id)
      selectedId.value = null
    }) },
    { keys: '⌘V', description: 'Einfügen', matches: command('v'), run: paste },
    { keys: '⌘D', description: 'Duplizieren', matches: command('d'), run: withSelection((id) => {
      selectedId.value = board.duplicateItem(id)
    }) },
    { keys: '⌫', description: 'Löschen', matches: plain('Backspace', 'Delete'), run: withSelection((id) => {
      board.removeItem(id)
      selectedId.value = null
    }) },
    { keys: 'Esc', description: 'Auswahl aufheben', matches: plain('Escape'), run: () => {
      selectedId.value = null
    } },
    { keys: '←↑→↓', description: 'Verschieben', matches: plain(...Object.keys(ARROWS)), run: withSelection((id, event) => {
      board.nudgeItem(id, ...ARROWS[event.key]!)
    }) },
  ]

  function onKeydown(event: KeyboardEvent) {
    // While typing, keys belong to the text field (⌫ deletes a letter, not the item).
    if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) return
    const shortcut = shortcuts.find(shortcut => shortcut.matches(event))
    if (!shortcut) return
    event.preventDefault()
    shortcut.run(event)
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}

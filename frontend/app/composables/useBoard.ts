import type { Note, Rect } from '~/types/note'

// The board state is the single source of truth for which notes exist and what they look like.
// Components only read it; every change goes through one of the functions below.
export function useBoard() {
  const notes = useState<Note[]>('notes', () => [
    { id: 'note-1', x: 120, y: 120, width: 192, height: 192, text: 'Hello, board!' },
    { id: 'note-2', x: 360, y: 120, width: 192, height: 192, text: 'Drag me around' },
  ])

  function updateNote(id: string, changes: Partial<Omit<Note, 'id'>>) {
    notes.value = notes.value.map(note => (note.id === id ? { ...note, ...changes } : note))
  }

  function moveNote(id: string, x: number, y: number) {
    updateNote(id, { x, y })
  }

  function resizeNote(id: string, rect: Rect) {
    updateNote(id, rect)
  }

  function updateText(id: string, text: string) {
    updateNote(id, { text })
  }

  return { notes: readonly(notes), moveNote, resizeNote, updateText }
}

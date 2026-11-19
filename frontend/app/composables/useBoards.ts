import type { Board } from '~/types/board'

const NEW_BOARD_NAME = 'Unbenanntes Board'

// The list of all boards, newest first. Like useBoard, the state changes right away
// and the backend is told afterwards.
export function useBoards() {
  const api = $fetch.create({ baseURL: useRuntimeConfig().public.apiBase })
  const boards = useState<Board[]>('boards', () => [])

  async function loadBoards() {
    boards.value = await api<Board[]>('/boards')
  }

  // Returns undefined if the board does not exist (any more).
  async function findBoard(id: string) {
    return api<Board>(`/boards/${id}`).catch(() => undefined)
  }

  // Waits for the backend, because the new board's id comes from the database.
  async function createBoard() {
    const board = await api<Board>('/boards', { method: 'POST', body: { name: NEW_BOARD_NAME } })
    boards.value = [board, ...boards.value]
    return board
  }

  function renameBoard(id: string, name: string) {
    boards.value = boards.value.map(board => (board.id === id ? { ...board, name } : board))
    api(`/boards/${id}`, { method: 'PATCH', body: { name } })
  }

  function deleteBoard(id: string) {
    boards.value = boards.value.filter(board => board.id !== id)
    api(`/boards/${id}`, { method: 'DELETE' })
  }

  return { boards: readonly(boards), loadBoards, findBoard, createBoard, renameBoard, deleteBoard }
}

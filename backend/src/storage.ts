import { fileURLToPath } from 'node:url'

// The backend treats objects as plain JSON; it only relies on every object having an id.
export type BoardObject = { id: string } & Record<string, unknown>

export type Board = { id: string; name: string; createdAt: string }

// The URL and secret key of the Supabase project live in backend/.env, which stays out of git.
process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)))

// Supabase offers every table as a REST endpoint, so plain fetch requests are enough.
// This module is the only place that knows about the database.
const API = `${process.env.SUPABASE_URL}/rest/v1`
const HEADERS = {
  'apikey': process.env.SUPABASE_SECRET_KEY!,
  'Content-Type': 'application/json',
  // Supabase answers with the rows it inserted, changed or deleted.
  'Prefer': 'return=representation',
}

// The frontend writes fontSize, the table names the column font_size.
function toRow({ fontSize, ...rest }: Record<string, unknown>) {
  return fontSize === undefined ? rest : { ...rest, font_size: fontSize }
}

// Columns an object does not use are null in the table (a circle has no text);
// they are left out so the frontend gets the same objects as before.
function toObject({ font_size, created_at, board_id, ...rest }: Record<string, unknown>) {
  const entries = Object.entries({ ...rest, fontSize: font_size })
  return Object.fromEntries(entries.filter(([, value]) => value !== null)) as BoardObject
}

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API}/${path}`, { ...init, headers: HEADERS })
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`)
  const rows: Record<string, unknown>[] = await response.json()
  return rows
}

async function requestObjects(query: string, init: RequestInit = {}) {
  return (await request(`objects?${query}`, init)).map(toObject)
}

// The frontend writes createdAt, the table names the column created_at.
function toBoard({ created_at, ...rest }: Record<string, unknown>) {
  return { ...rest, createdAt: created_at } as Board
}

async function requestBoards(query: string, init: RequestInit = {}) {
  return (await request(`boards?${query}`, init)).map(toBoard)
}

export async function listBoards() {
  // Newest first, so a board just created shows up at the front of the overview.
  return requestBoards('order=created_at.desc')
}

export async function findBoard(id: string) {
  const [board] = await requestBoards(`id=eq.${encodeURIComponent(id)}`)
  return board
}

export async function insertBoard(name: string) {
  const [inserted] = await requestBoards('', { method: 'POST', body: JSON.stringify({ name }) })
  return inserted
}

export async function renameBoard(id: string, name: string) {
  const body = JSON.stringify({ name })
  const [updated] = await requestBoards(`id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body })
  return updated
}

// The database also deletes every object on the board.
export async function deleteBoard(id: string) {
  const deleted = await requestBoards(`id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
  return deleted.length > 0
}

export async function listObjects(boardId: string) {
  // Oldest first, so objects added later are still drawn on top.
  return requestObjects(`board_id=eq.${encodeURIComponent(boardId)}&order=created_at`)
}

export async function insertObject(boardId: string, object: BoardObject) {
  const body = JSON.stringify({ ...toRow(object), board_id: boardId })
  const [inserted] = await requestObjects('', { method: 'POST', body })
  return inserted
}

export async function updateObject(id: string, changes: Record<string, unknown>) {
  const body = JSON.stringify(toRow({ ...changes, id }))
  const [updated] = await requestObjects(`id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body })
  return updated
}

export async function deleteObject(id: string) {
  const deleted = await requestObjects(`id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
  return deleted.length > 0
}

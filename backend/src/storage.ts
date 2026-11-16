import { createClient } from '@supabase/supabase-js'

// The backend treats objects as plain JSON; it only relies on every object having an id.
export type BoardObject = { id: string } & Record<string, unknown>
export type Board = { id: string; name: string; createdAt: string }

// This module is the only place that knows about the database.
// The secret key stays in the backend; it must never reach the browser.
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!)

// Postgres reports this code when a primary key already exists.
const DUPLICATE_KEY = '23505'

// Field names the frontend uses that are named differently in the tables.
const COLUMNS: Record<string, string> = { fontSize: 'font_size', createdAt: 'created_at' }
const FIELDS = Object.fromEntries(Object.entries(COLUMNS).map(([field, column]) => [column, field]))

function toRow(object: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [COLUMNS[key] ?? key, value]))
}

// Columns a variant does not have are empty (null) in the table; the frontend expects them to be missing.
function fromRow(row: Record<string, unknown>) {
  const fields = Object.entries(row).filter(([, value]) => value !== null)
  return Object.fromEntries(fields.map(([key, value]) => [FIELDS[key] ?? key, value]))
}

// The frontend already knows which board an object belongs to and draws them in list order.
function fromObjectRow({ board_id, created_at, ...row }: Record<string, unknown>) {
  return fromRow(row) as BoardObject
}

export async function listBoards() {
  const { data, error } = await supabase.from('boards').select().order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data.map(row => fromRow(row) as Board)
}

export async function getBoard(id: string) {
  const { data, error } = await supabase.from('boards').select().eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? (fromRow(data) as Board) : undefined
}

// Returns undefined if a board with this id already exists.
export async function insertBoard(board: Pick<Board, 'id' | 'name'>) {
  const { data, error } = await supabase.from('boards').insert(board).select().single()
  if (error?.code === DUPLICATE_KEY) return undefined
  if (error) throw new Error(error.message)
  return fromRow(data) as Board
}

export async function renameBoard(id: string, name: string) {
  const { data, error } = await supabase.from('boards').update({ name }).eq('id', id).select().maybeSingle()
  if (error) throw new Error(error.message)
  return data ? (fromRow(data) as Board) : undefined
}

// The database deletes the objects on the board as well (on delete cascade).
export async function deleteBoard(id: string) {
  const { data, error } = await supabase.from('boards').delete().eq('id', id).select()
  if (error) throw new Error(error.message)
  return data.length > 0
}

export async function listObjects(boardId: string) {
  // Oldest first, so newer objects are drawn on top.
  const { data, error } = await supabase.from('objects').select().eq('board_id', boardId).order('created_at')
  if (error) throw new Error(error.message)
  return data.map(fromObjectRow)
}

// Returns undefined if an object with this id already exists.
export async function insertObject(boardId: string, object: BoardObject) {
  const { data, error } = await supabase.from('objects').insert({ ...toRow(object), board_id: boardId }).select().single()
  if (error?.code === DUPLICATE_KEY) return undefined
  if (error) throw new Error(error.message)
  return fromObjectRow(data)
}

export async function updateObject(id: string, { id: _ignored, ...changes }: Record<string, unknown>) {
  const { data, error } = await supabase.from('objects').update(toRow(changes)).eq('id', id).select().maybeSingle()
  if (error) throw new Error(error.message)
  return data ? fromObjectRow(data) : undefined
}

export async function deleteObject(id: string) {
  const { data, error } = await supabase.from('objects').delete().eq('id', id).select()
  if (error) throw new Error(error.message)
  return data.length > 0
}

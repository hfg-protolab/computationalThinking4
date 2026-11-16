import { Hono } from 'hono'
import { deleteBoard, getBoard, insertBoard, insertObject, listBoards, listObjects, renameBoard } from './storage.js'

// REST routes for the boards and for the objects on one board.
export const boards = new Hono()

boards.get('/', async c => c.json(await listBoards()))

boards.post('/', async (c) => {
  const { id, name } = await c.req.json()
  if (typeof id !== 'string' || typeof name !== 'string') return c.json({ error: 'Board needs an id and a name' }, 400)
  const board = await insertBoard({ id, name })
  if (!board) return c.json({ error: 'A board with this id already exists' }, 409)
  return c.json(board, 201)
})

boards.get('/:id', async (c) => {
  const board = await getBoard(c.req.param('id'))
  if (!board) return c.json({ error: 'Board not found' }, 404)
  return c.json(board)
})

boards.patch('/:id', async (c) => {
  const { name } = await c.req.json()
  if (typeof name !== 'string') return c.json({ error: 'Board needs a name' }, 400)
  const board = await renameBoard(c.req.param('id'), name)
  if (!board) return c.json({ error: 'Board not found' }, 404)
  return c.json(board)
})

boards.delete('/:id', async (c) => {
  const deleted = await deleteBoard(c.req.param('id'))
  if (!deleted) return c.json({ error: 'Board not found' }, 404)
  return c.body(null, 204)
})

boards.get('/:id/objects', async (c) => {
  const boardId = c.req.param('id')
  if (!(await getBoard(boardId))) return c.json({ error: 'Board not found' }, 404)
  return c.json(await listObjects(boardId))
})

boards.post('/:id/objects', async (c) => {
  const boardId = c.req.param('id')
  const object = await c.req.json()
  if (typeof object.id !== 'string') return c.json({ error: 'Object needs an id' }, 400)
  if (!(await getBoard(boardId))) return c.json({ error: 'Board not found' }, 404)
  const created = await insertObject(boardId, object)
  if (!created) return c.json({ error: 'An object with this id already exists' }, 409)
  return c.json(created, 201)
})

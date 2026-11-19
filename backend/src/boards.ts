import { Hono } from 'hono'
import { deleteBoard, findBoard, insertBoard, insertObject, listBoards, listObjects, renameBoard } from './storage.js'

// REST routes for the boards and for the objects that live on a board.
export const boards = new Hono()

// A board always needs a name; surrounding spaces do not count.
function readName(body: { name?: unknown }) {
  return typeof body.name === 'string' && body.name.trim() ? body.name.trim() : undefined
}

boards.get('/', async c => c.json(await listBoards()))

boards.post('/', async (c) => {
  const name = readName(await c.req.json())
  if (!name) return c.json({ error: 'Board needs a name' }, 400)
  return c.json(await insertBoard(name), 201)
})

boards.get('/:id', async (c) => {
  const board = await findBoard(c.req.param('id'))
  if (!board) return c.json({ error: 'Board not found' }, 404)
  return c.json(board)
})

boards.patch('/:id', async (c) => {
  const name = readName(await c.req.json())
  if (!name) return c.json({ error: 'Board needs a name' }, 400)
  const updated = await renameBoard(c.req.param('id'), name)
  if (!updated) return c.json({ error: 'Board not found' }, 404)
  return c.json(updated)
})

boards.delete('/:id', async (c) => {
  const deleted = await deleteBoard(c.req.param('id'))
  if (!deleted) return c.json({ error: 'Board not found' }, 404)
  return c.body(null, 204)
})

boards.get('/:id/objects', async c => c.json(await listObjects(c.req.param('id'))))

boards.post('/:id/objects', async (c) => {
  const boardId = c.req.param('id')
  const object = await c.req.json()
  if (typeof object.id !== 'string') return c.json({ error: 'Object needs an id' }, 400)
  if (!(await findBoard(boardId))) return c.json({ error: 'Board not found' }, 404)
  if ((await listObjects(boardId)).some(existing => existing.id === object.id)) {
    return c.json({ error: 'An object with this id already exists' }, 409)
  }
  return c.json(await insertObject(boardId, object), 201)
})

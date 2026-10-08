import { Hono } from 'hono'
import { deleteObject, insertObject, listObjects, updateObject } from './storage.js'

// REST routes for the objects on the board.
export const objects = new Hono()

objects.get('/', async c => c.json(await listObjects()))

objects.post('/', async (c) => {
  const object = await c.req.json()
  if (typeof object.id !== 'string') return c.json({ error: 'Object needs an id' }, 400)
  if ((await listObjects()).some(existing => existing.id === object.id)) {
    return c.json({ error: 'An object with this id already exists' }, 409)
  }
  return c.json(await insertObject(object), 201)
})

objects.patch('/:id', async (c) => {
  const updated = await updateObject(c.req.param('id'), await c.req.json())
  if (!updated) return c.json({ error: 'Object not found' }, 404)
  return c.json(updated)
})

objects.delete('/:id', async (c) => {
  const deleted = await deleteObject(c.req.param('id'))
  if (!deleted) return c.json({ error: 'Object not found' }, 404)
  return c.body(null, 204)
})

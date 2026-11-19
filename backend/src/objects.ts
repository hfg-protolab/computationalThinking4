import { Hono } from 'hono'
import { deleteObject, updateObject } from './storage.js'

// REST routes for a single object. Listing and creating objects happens per board, see boards.ts.
export const objects = new Hono()

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

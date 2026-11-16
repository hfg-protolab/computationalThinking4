import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { boards } from './boards.js'
import { objects } from './objects.js'

const PORT = 3001

const app = new Hono()

// The frontend runs on another port, so the browser needs permission to call this API.
app.use('*', cors({ origin: 'http://localhost:3000' }))

app.get('/', c => c.json({ status: 'ok' }))
app.route('/boards', boards)
app.route('/objects', objects)

serve({ fetch: app.fetch, port: PORT }, info => {
  console.log(`Backend running on http://localhost:${info.port}`)
})

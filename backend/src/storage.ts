import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// The backend treats objects as plain JSON; it only relies on every object having an id.
export type BoardObject = { id: string } & Record<string, unknown>

const FILE = fileURLToPath(new URL('../data/board.json', import.meta.url))

// All objects live in memory and are written to the JSON file after every change.
// This module is the only place that knows about the file; a database can replace it later.
let objects: BoardObject[] = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []

function save() {
  mkdirSync(dirname(FILE), { recursive: true })
  writeFileSync(FILE, JSON.stringify(objects, null, 2))
}

export async function listObjects() {
  return objects
}

export async function insertObject(object: BoardObject) {
  objects = [...objects, object]
  save()
  return object
}

export async function updateObject(id: string, changes: Record<string, unknown>) {
  const existing = objects.find(object => object.id === id)
  if (!existing) return undefined
  const updated = { ...existing, ...changes, id }
  objects = objects.map(object => (object.id === id ? updated : object))
  save()
  return updated
}

export async function deleteObject(id: string) {
  const before = objects.length
  objects = objects.filter(object => object.id !== id)
  save()
  return objects.length < before
}

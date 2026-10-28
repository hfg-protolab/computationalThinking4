import type { StyleAttribute, StyleAttributes } from '~/models/attributes'
import type { BoardItem, Corner, Rect } from '~/models/BoardItem'
import { StickyNote } from '~/models/StickyNote'
import { TextItem } from '~/models/TextItem'

// Single source of truth for all board objects.
// Components only read `items`; every change goes through one of the functions below.
const items = ref<BoardItem[]>([
  new StickyNote({ x: 120, y: 120, width: 192, height: 192 }, '#fef08a', 'Hello, board!'),
])

function find(id: string) {
  return items.value.find(item => item.id === id)
}

// Places a new item so that its center sits at the given board position.
function addItemAt(item: BoardItem, centerX: number, centerY: number) {
  item.moveTo(centerX - item.width / 2, centerY - item.height / 2)
  items.value.push(item)
  return item.id
}

// Adds a copy of the given item, shifted by one grid cell so it does not hide the original.
function addCopy(item: BoardItem) {
  const copy = item.clone()
  copy.moveTo(item.x + GRID_SIZE, item.y + GRID_SIZE)
  items.value.push(copy)
  return copy.id
}

// Returns a detached copy, e.g. for the clipboard. The board itself does not change.
function copyItem(id: string) {
  return find(id)?.clone() ?? null
}

function duplicateItem(id: string) {
  const item = find(id)
  return item ? addCopy(item) : null
}

function removeItem(id: string) {
  items.value = items.value.filter(item => item.id !== id)
}

function moveItem(id: string, x: number, y: number) {
  find(id)?.moveTo(x, y)
}

// Moves an item by whole grid cells, e.g. with the arrow keys.
function nudgeItem(id: string, columns: number, rows: number) {
  const item = find(id)
  item?.moveTo(item.x + columns * GRID_SIZE, item.y + rows * GRID_SIZE)
}

function resizeItem(id: string, corner: Corner, start: Rect, dx: number, dy: number) {
  find(id)?.resizeFrom(corner, start, dx, dy)
}

function growItemToFit(id: string, contentHeight: number) {
  find(id)?.growToFit(contentHeight)
}

function setText(id: string, text: string) {
  const item = find(id)
  if (item instanceof StickyNote || item instanceof TextItem) item.text = text
}

// Only changes the attribute if the item actually has it (a circle has no font size).
function setStyle<K extends StyleAttribute>(id: string, attribute: K, value: StyleAttributes[K]) {
  const item = find(id)
  if (item && attribute in item) Object.assign(item, { [attribute]: value })
}

export function useBoard() {
  return {
    items: readonly(items),
    addItemAt,
    addCopy,
    copyItem,
    duplicateItem,
    removeItem,
    moveItem,
    nudgeItem,
    resizeItem,
    growItemToFit,
    setText,
    setStyle,
  }
}

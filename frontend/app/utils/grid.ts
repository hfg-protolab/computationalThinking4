export const GRID_SIZE = 24
export const MIN_NOTE_SIZE = GRID_SIZE * 3

export function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

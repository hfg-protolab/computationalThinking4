export interface Note {
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
}

export type Rect = Pick<Note, 'x' | 'y' | 'width' | 'height'>

export type FontSize = 'sm' | 'md' | 'lg'
export type BorderWidth = 'none' | 'thin' | 'thick'

// All style attributes an item can have. Each item class only declares the ones that fit it.
export interface StyleAttributes {
  color: string
  fontSize: FontSize
  bold: boolean
  border: BorderWidth
}

export type StyleAttribute = keyof StyleAttributes

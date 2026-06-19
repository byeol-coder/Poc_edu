// Encode a 60 x 40 tactile matrix into the DotPad graphic hex string that
// DotPadSDK.displayGraphicData() expects (GraphicMode).
//
// DotPad graphic standard (60 x 40 pins):
//   - 1 graphic page  = 60 x 40 pins = 2,400 dots
//   - 1 cell          = 2 x 4 pins (8 dots) = 1 byte
//   - 60 x 40 pins    = 30 x 10 cells = 300 bytes = 600 hex chars
//
// Bit order (GraphicMode native order). The SDK sends GraphicMode data as-is
// (seqNum "00", no braille->graphic remap), so the bytes must already be in the
// device's graphic order. Inverting the SDK's own `brailleToGraphic` transform
// yields a clean column-major layout within each 2 x 4 cell:
//
//     bit = column * 4 + row     (column in 0..1, row in 0..3)
//
//   dot positions inside a cell      resulting bit
//     (0,0)(1,0)                       0   4
//     (0,1)(1,1)            ->         1   5
//     (0,2)(1,2)                       2   6
//     (0,3)(1,3)                       3   7

export const DOTPAD = Object.freeze({
  width: 60,
  height: 40,
  cellWidth: 2,
  cellHeight: 4,
  cellsX: 30,
  cellsY: 10,
  byteLength: 300,
  hexLength: 600,
})

export type TactileMatrix = boolean[][]

/** Validate that a matrix is exactly 40 rows x 60 columns. */
export function assertMatrix(matrix: TactileMatrix): void {
  if (!Array.isArray(matrix) || matrix.length !== DOTPAD.height) {
    throw new Error(`DotPad matrix must have exactly ${DOTPAD.height} rows.`)
  }
  for (let y = 0; y < DOTPAD.height; y += 1) {
    if (!Array.isArray(matrix[y]) || matrix[y].length !== DOTPAD.width) {
      throw new Error(`DotPad matrix row ${y} must have exactly ${DOTPAD.width} columns.`)
    }
  }
}

/** Encode a 40 x 60 boolean matrix to a 300-byte array (graphic cell order). */
export function encodeGraphicBytes(matrix: TactileMatrix): number[] {
  assertMatrix(matrix)
  const bytes: number[] = []

  for (let cellY = 0; cellY < DOTPAD.cellsY; cellY += 1) {
    for (let cellX = 0; cellX < DOTPAD.cellsX; cellX += 1) {
      const baseX = cellX * DOTPAD.cellWidth
      const baseY = cellY * DOTPAD.cellHeight
      let byte = 0

      for (let col = 0; col < DOTPAD.cellWidth; col += 1) {
        for (let row = 0; row < DOTPAD.cellHeight; row += 1) {
          if (matrix[baseY + row][baseX + col]) {
            byte |= 1 << (col * DOTPAD.cellHeight + row)
          }
        }
      }

      bytes.push(byte)
    }
  }

  return bytes
}

/** Encode a 40 x 60 boolean matrix to a 600-char uppercase hex string. */
export function encodeGraphicHex(matrix: TactileMatrix): string {
  return encodeGraphicBytes(matrix)
    .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
    .join('')
}

// Single source of truth for the 60 x 40 tactile scenes.
//
// Both the on-screen SVG preview and the real DotPad output read from these
// builders, so what a sighted reviewer sees on screen is exactly what is pushed
// to the hardware. The pixel logic is lifted verbatim from the original inline
// preview code in App.tsx (live classroom) and RecordedLecture.tsx (recorded).

import type { LessonId } from '../../data'
import { DOTPAD, type TactileMatrix } from './encode'

export type Dot = { x: number; y: number; raised: boolean }

function emptyMatrix(): TactileMatrix {
  return Array.from({ length: DOTPAD.height }, () =>
    Array.from({ length: DOTPAD.width }, () => false),
  )
}

/** Live classroom DotPad scene for the selected lesson. */
export function buildLiveMatrix(lessonId: LessonId, ready: boolean): TactileMatrix {
  const matrix = emptyMatrix()
  if (!ready) return matrix

  for (let y = 0; y < DOTPAD.height; y += 1) {
    for (let x = 0; x < DOTPAD.width; x += 1) {
      let raised = false
      if (lessonId === 'plant') {
        const stem = Math.abs(x - 30) < 1 && y > 9 && y < 30
        const flower = Math.hypot(x - 30, y - 8) < 5 && Math.hypot(x - 30, y - 8) > 2.2
        const leafLeft = ((x - 23) / 8) ** 2 + ((y - 17) / 4) ** 2 < 1
        const leafRight = ((x - 37) / 8) ** 2 + ((y - 14) / 4) ** 2 < 1
        const soil = y === 30 && x > 5 && x < 55
        const roots =
          y > 29 &&
          (Math.abs(x - (30 - (y - 29) * 0.7)) < 1 ||
            Math.abs(x - (30 + (y - 29) * 0.75)) < 1 ||
            Math.abs(x - 30) < 1)
        raised = stem || flower || leafLeft || leafRight || soil || roots
      } else if (lessonId === 'solar') {
        const sun = Math.hypot(x - 10, y - 20) < 5
        const orbit1 = Math.abs(((x - 10) / 15) ** 2 + ((y - 20) / 7) ** 2 - 1) < 0.16
        const orbit2 = Math.abs(((x - 10) / 25) ** 2 + ((y - 20) / 12) ** 2 - 1) < 0.12
        const orbit3 = Math.abs(((x - 10) / 37) ** 2 + ((y - 20) / 17) ** 2 - 1) < 0.1
        const planet = Math.hypot(x - 35, y - 12) < 2.2
        raised = sun || orbit1 || orbit2 || orbit3 || planet
      } else {
        const sea = y === 31 + Math.round(Math.sin(x / 4)) && x > 2 && x < 57
        const mountain = Math.abs(y - (31 - Math.abs(x - 43) * 0.7)) < 1 && x > 31 && x < 55
        const cloud =
          Math.hypot(x - 34, y - 10) < 4 ||
          Math.hypot(x - 40, y - 9) < 5 ||
          Math.hypot(x - 46, y - 11) < 4
        const rain = x > 34 && x < 49 && y > 14 && y < 25 && (x + y) % 5 === 0
        const vapor = x > 12 && x < 22 && y > 15 && y < 30 && (x - y) % 5 === 0
        raised = sea || mountain || cloud || rain || vapor
      }
      matrix[y][x] = raised
    }
  }

  return matrix
}

/** Recorded lecture DotPad scene for the selected timeline marker. */
export function buildRecordedMatrix(markerIndex: number): TactileMatrix {
  const matrix = emptyMatrix()

  for (let y = 0; y < DOTPAD.height; y += 1) {
    for (let x = 0; x < DOTPAD.width; x += 1) {
      const stem = Math.abs(x - 30) < 1 && y > 6 && y < 27
      const leafLeft = ((x - 23) / 8) ** 2 + ((y - 14) / 4) ** 2 < 1
      const leafRight = ((x - 37) / 8) ** 2 + ((y - 11) / 4) ** 2 < 1
      const soil = y === 27 && x > 4 && x < 56
      const rootMain = y > 26 && Math.abs(x - 30) < 1
      const rootLeft = y > 27 && Math.abs(x - (30 - (y - 27) * 1.3)) < 1
      const rootRight = y > 27 && Math.abs(x - (30 + (y - 27) * 1.35)) < 1
      const flower = markerIndex < 2 && Math.hypot(x - 30, y - 5) < 4
      const rootFocus =
        markerIndex >= 2
          ? rootMain || rootLeft || rootRight || soil
          : stem || leafLeft || leafRight || flower || soil || rootMain || rootLeft || rootRight
      matrix[y][x] = rootFocus
    }
  }

  return matrix
}

/** Flatten a matrix into the {x, y, raised} dots the SVG previews render. */
export function matrixToDots(matrix: TactileMatrix): Dot[] {
  const dots: Dot[] = []
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      dots.push({ x, y, raised: matrix[y][x] })
    }
  }
  return dots
}

/** Count of raised pins — handy for status copy ("1,024 of 2,400 pins"). */
export function countRaised(matrix: TactileMatrix): number {
  let count = 0
  for (const row of matrix) for (const cell of row) if (cell) count += 1
  return count
}

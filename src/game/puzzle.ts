export type Board = number[]
export type Direction = 'up' | 'right' | 'down' | 'left'

export const BOARD_SIZE = 4
export const SOLVED_BOARD: Board = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) =>
  index === BOARD_SIZE * BOARD_SIZE - 1 ? 0 : index + 1,
)

export function isSolved(board: Board): boolean {
  return board.every((tile, index) => tile === SOLVED_BOARD[index])
}

export function isSolvable(board: Board): boolean {
  const tiles = board.filter((tile) => tile !== 0)
  let inversions = 0
  for (let left = 0; left < tiles.length; left++) {
    for (let right = left + 1; right < tiles.length; right++) {
      if (tiles[left] > tiles[right]) inversions++
    }
  }

  const blankIndex = board.indexOf(0)
  const blankRowFromBottom = BOARD_SIZE - Math.floor(blankIndex / BOARD_SIZE)
  return (inversions + blankRowFromBottom) % 2 === 1
}

export function moveTile(board: Board, tileIndex: number): Board | null {
  if (tileIndex < 0 || tileIndex >= board.length || board[tileIndex] === 0) return null
  const emptyIndex = board.indexOf(0)
  const tileRow = Math.floor(tileIndex / BOARD_SIZE)
  const tileCol = tileIndex % BOARD_SIZE
  const emptyRow = Math.floor(emptyIndex / BOARD_SIZE)
  const emptyCol = emptyIndex % BOARD_SIZE
  const distance = Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol)
  if (distance !== 1) return null

  const next = [...board]
  ;[next[tileIndex], next[emptyIndex]] = [next[emptyIndex], next[tileIndex]]
  return next
}

export function shuffleBoard(random: () => number = Math.random, steps = 180): Board {
  let board = [...SOLVED_BOARD]
  let previousEmptyIndex = -1

  for (let step = 0; step < steps; step++) {
    const emptyIndex = board.indexOf(0)
    const emptyRow = Math.floor(emptyIndex / BOARD_SIZE)
    const emptyCol = emptyIndex % BOARD_SIZE
    const candidates = board
      .map((_, index) => index)
      .filter((index) => {
        const row = Math.floor(index / BOARD_SIZE)
        const col = index % BOARD_SIZE
        return index !== previousEmptyIndex && Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1
      })
    const sample = Math.max(0, Math.min(random(), 0.999999999))
    const tileIndex = candidates[Math.floor(sample * candidates.length)]
    const next = moveTile(board, tileIndex)
    if (next) board = next
    previousEmptyIndex = emptyIndex
  }

  if (isSolved(board)) {
    const emptyIndex = board.length - 1
    const next = moveTile(board, emptyIndex - 1)
    if (next) board = next
  }

  return board
}

import { describe, expect, it } from 'vitest'
import { isSolvable, isSolved, moveTile, shuffleBoard, SOLVED_BOARD } from './puzzle'

describe('puzzle logic', () => {
  it('slides a tile adjacent to the empty cell', () => {
    const board = [...SOLVED_BOARD]
    const moved = moveTile(board, 14)

    expect(moved).not.toBeNull()
    expect(moved?.[14]).toBe(0)
    expect(moved?.[15]).toBe(15)
    expect(board).toEqual(SOLVED_BOARD)
  })

  it('rejects a tile that is not adjacent to the empty cell', () => {
    expect(moveTile(SOLVED_BOARD, 0)).toBeNull()
  })

  it('recognizes the solved board', () => {
    expect(isSolved(SOLVED_BOARD)).toBe(true)
    expect(isSolved([2, 1, ...SOLVED_BOARD.slice(2)])).toBe(false)
  })

  it('shuffles to a different, solvable board', () => {
    const board = shuffleBoard(() => 0.37, 80)

    expect(board).toHaveLength(16)
    expect([...board].sort((a, b) => a - b)).toEqual([...Array(16).keys()])
    expect(isSolved(board)).toBe(false)
    expect(isSolvable(board)).toBe(true)
  })
})

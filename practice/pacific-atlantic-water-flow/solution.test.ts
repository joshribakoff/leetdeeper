import { describe, it, expect } from 'vitest'
import { pacificAtlantic } from './solution'

describe('Pacific Atlantic Water Flow', () => {
  it('example 1', () => {
    const heights = [
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4]
    ]
    const result = pacificAtlantic(heights)
    const expected = [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
    expect(result.sort()).toEqual(expected.sort())
  })

  it('example 2: [[1]] -> [[0,0]]', () => {
    expect(pacificAtlantic([[1]])).toEqual([[0, 0]])
  })
})

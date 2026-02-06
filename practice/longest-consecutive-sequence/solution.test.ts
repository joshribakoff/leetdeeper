import { describe, it, expect } from 'vitest'
import { longestConsecutive } from './solution'

describe('Longest Consecutive Sequence', () => {
  it('example 1: [100,4,200,1,3,2] -> 4', () => {
    expect(longestConsecutive([100, 4, 200, 1, 3, 2])).toBe(4) // [1,2,3,4]
  })

  it('example 2: [0,3,7,2,5,8,4,6,0,1] -> 9', () => {
    expect(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9)
  })

  it('empty array', () => {
    expect(longestConsecutive([])).toBe(0)
  })
})

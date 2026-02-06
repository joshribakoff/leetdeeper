import { describe, it, expect } from 'vitest'
import { lengthOfLIS } from './solution'

describe('Longest Increasing Subsequence', () => {
  it('example 1: [10,9,2,5,3,7,101,18] -> 4', () => {
    expect(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4) // [2,3,7,101]
  })

  it('example 2: [0,1,0,3,2,3] -> 4', () => {
    expect(lengthOfLIS([0, 1, 0, 3, 2, 3])).toBe(4)
  })

  it('example 3: [7,7,7,7,7,7,7] -> 1', () => {
    expect(lengthOfLIS([7, 7, 7, 7, 7, 7, 7])).toBe(1)
  })
})

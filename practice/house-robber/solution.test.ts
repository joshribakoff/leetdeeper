import { describe, it, expect } from 'vitest'
import { rob } from './solution'

describe('House Robber', () => {
  it('example 1: [1,2,3,1] -> 4', () => {
    expect(rob([1, 2, 3, 1])).toBe(4) // rob house 1 and 3
  })

  it('example 2: [2,7,9,3,1] -> 12', () => {
    expect(rob([2, 7, 9, 3, 1])).toBe(12) // rob house 1, 3, 5
  })
})

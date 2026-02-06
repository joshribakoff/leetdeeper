import { describe, it, expect } from 'vitest'
import { rob } from './solution'

describe('House Robber II', () => {
  it('example 1: [2,3,2] -> 3', () => {
    expect(rob([2, 3, 2])).toBe(3) // cannot rob first and last (circular)
  })

  it('example 2: [1,2,3,1] -> 4', () => {
    expect(rob([1, 2, 3, 1])).toBe(4)
  })

  it('example 3: [1,2,3] -> 3', () => {
    expect(rob([1, 2, 3])).toBe(3)
  })
})

import { describe, it, expect } from 'vitest'
import { uniquePaths } from './solution'

describe('Unique Paths', () => {
  it('example 1: m=3, n=7 -> 28', () => {
    expect(uniquePaths(3, 7)).toBe(28)
  })

  it('example 2: m=3, n=2 -> 3', () => {
    expect(uniquePaths(3, 2)).toBe(3)
  })
})

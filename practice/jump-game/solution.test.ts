import { describe, it, expect } from 'vitest'
import { canJump } from './solution'

describe('Jump Game', () => {
  it('example 1: [2,3,1,1,4] -> true', () => {
    expect(canJump([2, 3, 1, 1, 4])).toBe(true)
  })

  it('example 2: [3,2,1,0,4] -> false', () => {
    expect(canJump([3, 2, 1, 0, 4])).toBe(false)
  })
})

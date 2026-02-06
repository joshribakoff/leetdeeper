import { describe, it, expect } from 'vitest'
import { coinChange } from './solution'

describe('Coin Change', () => {
  it('example 1: coins=[1,2,5], amount=11 -> 3', () => {
    expect(coinChange([1, 2, 5], 11)).toBe(3) // 5+5+1
  })

  it('example 2: coins=[2], amount=3 -> -1', () => {
    expect(coinChange([2], 3)).toBe(-1)
  })

  it('example 3: coins=[1], amount=0 -> 0', () => {
    expect(coinChange([1], 0)).toBe(0)
  })
})

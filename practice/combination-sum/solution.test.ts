import { describe, it, expect } from 'vitest'
import { combinationSum } from './solution'

describe('Combination Sum', () => {
  it('example 1: candidates=[2,3,6,7], target=7', () => {
    const result = combinationSum([2, 3, 6, 7], 7)
    expect(result).toHaveLength(2)
    expect(result).toContainEqual([2, 2, 3])
    expect(result).toContainEqual([7])
  })

  it('example 2: candidates=[2,3,5], target=8', () => {
    const result = combinationSum([2, 3, 5], 8)
    expect(result).toHaveLength(3)
    expect(result).toContainEqual([2, 2, 2, 2])
    expect(result).toContainEqual([2, 3, 3])
    expect(result).toContainEqual([3, 5])
  })

  it('example 3: candidates=[2], target=1 -> []', () => {
    expect(combinationSum([2], 1)).toEqual([])
  })
})

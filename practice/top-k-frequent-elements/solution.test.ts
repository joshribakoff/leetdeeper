import { describe, test, expect } from 'vitest'
import { topKFrequent } from './solution'

describe('Top K Frequent Elements', () => {
  test('example 1: [1,1,1,2,2,3], k=2 -> [1,2]', () => {
    const result = topKFrequent([1, 1, 1, 2, 2, 3], 2)
    expect(result.sort()).toEqual([1, 2].sort())
  })

  test('example 2: [1], k=1 -> [1]', () => {
    expect(topKFrequent([1], 1)).toEqual([1])
  })

  test('all same frequency', () => {
    const result = topKFrequent([1, 2, 3], 2)
    expect(result.length).toBe(2)
  })
})

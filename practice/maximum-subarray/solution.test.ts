import { test, expect } from 'vitest'
import { maxSubArray } from './solution'

test('example 1: [-2,1,-3,4,-1,2,1,-5,4]', () => {
  expect(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6)
})

test('example 2: [1]', () => {
  expect(maxSubArray([1])).toBe(1)
})

test('example 3: [5,4,-1,7,8]', () => {
  expect(maxSubArray([5, 4, -1, 7, 8])).toBe(23)
})

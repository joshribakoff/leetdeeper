import { test, expect } from 'vitest'
import { maxArea } from './solution'

test('example 1: [1,8,6,2,5,4,8,3,7]', () => {
  expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49)
})

test('example 2: [1,1]', () => {
  expect(maxArea([1, 1])).toBe(1)
})

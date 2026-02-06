import { test, expect } from 'vitest'
import { findMin } from './solution'

test('example 1: [3,4,5,1,2]', () => {
  expect(findMin([3, 4, 5, 1, 2])).toBe(1)
})

test('example 2: [4,5,6,7,0,1,2]', () => {
  expect(findMin([4, 5, 6, 7, 0, 1, 2])).toBe(0)
})

test('example 3: [11,13,15,17]', () => {
  expect(findMin([11, 13, 15, 17])).toBe(11)
})

import { test, expect } from 'vitest'
import { twoSum } from './solution'

test('example 1: [2,7,11,15], target=9', () => {
  expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1])
})

test('example 2: [3,2,4], target=6', () => {
  expect(twoSum([3, 2, 4], 6)).toEqual([1, 2])
})

test('example 3: [3,3], target=6', () => {
  expect(twoSum([3, 3], 6)).toEqual([0, 1])
})

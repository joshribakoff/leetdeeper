import { test, expect } from 'vitest'
import { threeSum } from './solution'

test('example 1: [-1,0,1,2,-1,-4]', () => {
  expect(threeSum([-1, 0, 1, 2, -1, -4])).toEqual([[-1, -1, 2], [-1, 0, 1]])
})

test('example 2: [0,1,1] - no triplets', () => {
  expect(threeSum([0, 1, 1])).toEqual([])
})

test('example 3: [0,0,0]', () => {
  expect(threeSum([0, 0, 0])).toEqual([[0, 0, 0]])
})

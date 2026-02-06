import { test, expect } from 'vitest'
import { productExceptSelf } from './solution'

test('example 1: [1,2,3,4]', () => {
  expect(productExceptSelf([1, 2, 3, 4])).toEqual([24, 12, 8, 6])
})

test('example 2: [-1,1,0,-3,3]', () => {
  expect(productExceptSelf([-1, 1, 0, -3, 3])).toEqual([0, 0, 9, 0, 0])
})

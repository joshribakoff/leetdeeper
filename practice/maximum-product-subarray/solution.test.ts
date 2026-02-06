import { test, expect } from 'vitest'
import { maxProduct } from './solution'

test('example 1: [2,3,-2,4]', () => {
  expect(maxProduct([2, 3, -2, 4])).toBe(6)
})

test('example 2: [-2,0,-1]', () => {
  expect(maxProduct([-2, 0, -1])).toBe(0)
})

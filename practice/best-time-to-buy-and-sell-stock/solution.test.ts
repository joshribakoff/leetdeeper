import { test, expect } from 'vitest'
import { maxProfit } from './solution'

test('example 1: [7,1,5,3,6,4]', () => {
  expect(maxProfit([7, 1, 5, 3, 6, 4])).toBe(5)
})

test('example 2: [7,6,4,3,1] - no profit', () => {
  expect(maxProfit([7, 6, 4, 3, 1])).toBe(0)
})

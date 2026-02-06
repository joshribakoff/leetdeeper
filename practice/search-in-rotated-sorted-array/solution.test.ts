import { test, expect } from 'vitest'
import { search } from './solution'

test('example 1: [4,5,6,7,0,1,2], target=0', () => {
  expect(search([4, 5, 6, 7, 0, 1, 2], 0)).toBe(4)
})

test('example 2: [4,5,6,7,0,1,2], target=3 - not found', () => {
  expect(search([4, 5, 6, 7, 0, 1, 2], 3)).toBe(-1)
})

test('example 3: [1], target=0 - not found', () => {
  expect(search([1], 0)).toBe(-1)
})

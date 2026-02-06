import { test, expect } from 'vitest'
import { containsDuplicate } from './solution'

test('example 1: [1,2,3,1] - has duplicate', () => {
  expect(containsDuplicate([1, 2, 3, 1])).toBe(true)
})

test('example 2: [1,2,3,4] - no duplicate', () => {
  expect(containsDuplicate([1, 2, 3, 4])).toBe(false)
})

test('example 3: [1,1,1,3,3,4,3,2,4,2] - has duplicates', () => {
  expect(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true)
})

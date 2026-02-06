import { test, expect } from 'vitest'
import { countBits } from './solution'

test('example 1: n=2', () => {
  expect(countBits(2)).toEqual([0, 1, 1])
})

test('example 2: n=5', () => {
  expect(countBits(5)).toEqual([0, 1, 1, 2, 1, 2])
})

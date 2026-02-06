import { test, expect } from 'vitest'
import { climbStairs } from './solution'

test('example 1: n=2', () => {
  expect(climbStairs(2)).toBe(2)
})

test('example 2: n=3', () => {
  expect(climbStairs(3)).toBe(3)
})

import { describe, test, expect } from 'vitest'
import { eraseOverlapIntervals } from './solution'

test('example 1: [[1,2],[2,3],[3,4],[1,3]]', () => {
  expect(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])).toBe(1)
})

test('example 2: [[1,2],[1,2],[1,2]]', () => {
  expect(eraseOverlapIntervals([[1,2],[1,2],[1,2]])).toBe(2)
})

test('example 3: [[1,2],[2,3]]', () => {
  expect(eraseOverlapIntervals([[1,2],[2,3]])).toBe(0)
})

test('single interval', () => {
  expect(eraseOverlapIntervals([[1,2]])).toBe(0)
})

test('all overlapping', () => {
  expect(eraseOverlapIntervals([[1,4],[2,3],[3,4]])).toBe(1)
})

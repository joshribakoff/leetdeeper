import { describe, test, expect } from 'vitest'
import { countComponents } from './solution'

test('example 1: two components', () => {
  expect(countComponents(5, [[0,1],[1,2],[3,4]])).toBe(2)
})

test('example 2: one component', () => {
  expect(countComponents(5, [[0,1],[1,2],[2,3],[3,4]])).toBe(1)
})

test('no edges, all isolated', () => {
  expect(countComponents(3, [])).toBe(3)
})

test('single node', () => {
  expect(countComponents(1, [])).toBe(1)
})

test('all connected', () => {
  expect(countComponents(4, [[0,1],[1,2],[2,3],[0,3]])).toBe(1)
})

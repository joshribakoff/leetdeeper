import { describe, test, expect } from 'vitest'
import { validTree } from './solution'

test('example 1: valid tree', () => {
  expect(validTree(5, [[0,1],[0,2],[0,3],[1,4]])).toBe(true)
})

test('example 2: has cycle', () => {
  expect(validTree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]])).toBe(false)
})

test('single node, no edges', () => {
  expect(validTree(1, [])).toBe(true)
})

test('two nodes, one edge', () => {
  expect(validTree(2, [[0,1]])).toBe(true)
})

test('disconnected nodes', () => {
  expect(validTree(4, [[0,1],[2,3]])).toBe(false)
})

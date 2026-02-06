import { describe, test, expect } from 'vitest'
import { insert } from './solution'

test('example 1: insert [2,5] into [[1,3],[6,9]]', () => {
  expect(insert([[1,3],[6,9]], [2,5])).toEqual([[1,5],[6,9]])
})

test('example 2: insert [4,8] merges multiple', () => {
  expect(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])).toEqual([[1,2],[3,10],[12,16]])
})

test('empty intervals', () => {
  expect(insert([], [5,7])).toEqual([[5,7]])
})

test('insert at beginning', () => {
  expect(insert([[3,5],[6,9]], [1,2])).toEqual([[1,2],[3,5],[6,9]])
})

test('insert at end', () => {
  expect(insert([[1,2],[3,5]], [6,8])).toEqual([[1,2],[3,5],[6,8]])
})

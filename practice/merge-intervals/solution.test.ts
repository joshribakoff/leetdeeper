import { describe, test, expect } from 'vitest'
import { merge } from './solution'

test('example 1: [[1,3],[2,6],[8,10],[15,18]]', () => {
  expect(merge([[1,3],[2,6],[8,10],[15,18]])).toEqual([[1,6],[8,10],[15,18]])
})

test('example 2: [[1,4],[4,5]]', () => {
  expect(merge([[1,4],[4,5]])).toEqual([[1,5]])
})

test('single interval', () => {
  expect(merge([[1,4]])).toEqual([[1,4]])
})

test('no overlap', () => {
  expect(merge([[1,2],[4,5]])).toEqual([[1,2],[4,5]])
})

test('all merge into one', () => {
  expect(merge([[1,4],[2,3],[3,6]])).toEqual([[1,6]])
})

import { describe, test, expect } from 'vitest'
import { setZeroes } from './solution'

test('example 1: [[1,1,1],[1,0,1],[1,1,1]]', () => {
  const matrix = [[1,1,1],[1,0,1],[1,1,1]]
  setZeroes(matrix)
  expect(matrix).toEqual([[1,0,1],[0,0,0],[1,0,1]])
})

test('example 2: [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', () => {
  const matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
  setZeroes(matrix)
  expect(matrix).toEqual([[0,0,0,0],[0,4,5,0],[0,3,1,0]])
})

test('no zeroes', () => {
  const matrix = [[1,2],[3,4]]
  setZeroes(matrix)
  expect(matrix).toEqual([[1,2],[3,4]])
})

test('all zeroes', () => {
  const matrix = [[0,0],[0,0]]
  setZeroes(matrix)
  expect(matrix).toEqual([[0,0],[0,0]])
})

test('single element zero', () => {
  const matrix = [[0]]
  setZeroes(matrix)
  expect(matrix).toEqual([[0]])
})

test('single element non-zero', () => {
  const matrix = [[1]]
  setZeroes(matrix)
  expect(matrix).toEqual([[1]])
})

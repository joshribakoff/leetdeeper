import { describe, test, expect } from 'vitest'
import { getSum } from './solution'

describe('Sum of Two Integers', () => {
  test('example 1: 1 + 2 = 3', () => {
    expect(getSum(1, 2)).toBe(3)
  })

  test('example 2: 2 + 3 = 5', () => {
    expect(getSum(2, 3)).toBe(5)
  })

  test('negative numbers: -1 + 1 = 0', () => {
    expect(getSum(-1, 1)).toBe(0)
  })

  test('both negative: -1 + -1 = -2', () => {
    expect(getSum(-1, -1)).toBe(-2)
  })

  test('zero: 0 + 0 = 0', () => {
    expect(getSum(0, 0)).toBe(0)
  })

  test('larger numbers: 100 + 200 = 300', () => {
    expect(getSum(100, 200)).toBe(300)
  })
})

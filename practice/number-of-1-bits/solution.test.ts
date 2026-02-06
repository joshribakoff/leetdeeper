import { test, expect } from 'vitest'
import { hammingWeight } from './solution'

test('example 1: 11 (binary: 1011)', () => {
  expect(hammingWeight(11)).toBe(3)
})

test('example 2: 128 (binary: 10000000)', () => {
  expect(hammingWeight(128)).toBe(1)
})

test('example 3: 2147483645 (binary: 1111111111111111111111111111101)', () => {
  expect(hammingWeight(2147483645)).toBe(30)
})

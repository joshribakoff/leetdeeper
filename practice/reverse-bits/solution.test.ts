import { test, expect } from 'vitest'
import { reverseBits } from './solution'

test('example 1: 43261596', () => {
  // Input:  00000010100101000001111010011100
  // Output: 00111001011110000010100101000000 = 964176192
  expect(reverseBits(43261596)).toBe(964176192)
})

test('example 2: 4294967293', () => {
  // Input:  11111111111111111111111111111101
  // Output: 10111111111111111111111111111111 = 3221225471
  expect(reverseBits(4294967293)).toBe(3221225471)
})

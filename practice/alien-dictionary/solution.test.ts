import { describe, test, expect } from 'vitest'
import { alienOrder } from './solution'

test('example 1: ["wrt","wrf","er","ett","rftt"] -> "wertf"', () => {
  expect(alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt'])).toBe('wertf')
})

test('example 2: ["z","x"] -> "zx"', () => {
  expect(alienOrder(['z', 'x'])).toBe('zx')
})

test('example 3: ["z","x","z"] -> "" (invalid)', () => {
  expect(alienOrder(['z', 'x', 'z'])).toBe('')
})

test('single word', () => {
  expect(alienOrder(['abc'])).toBe('abc')
})

test('invalid prefix order', () => {
  expect(alienOrder(['abc', 'ab'])).toBe('')
})

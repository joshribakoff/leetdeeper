import { describe, test, expect } from 'vitest'
import { isAnagram } from './solution'

describe('Valid Anagram', () => {
  test('example 1: "anagram", "nagaram" -> true', () => {
    expect(isAnagram('anagram', 'nagaram')).toBe(true)
  })

  test('example 2: "rat", "car" -> false', () => {
    expect(isAnagram('rat', 'car')).toBe(false)
  })

  test('empty strings', () => {
    expect(isAnagram('', '')).toBe(true)
  })

  test('different lengths', () => {
    expect(isAnagram('ab', 'abc')).toBe(false)
  })

  test('same letters different counts', () => {
    expect(isAnagram('aab', 'abb')).toBe(false)
  })
})

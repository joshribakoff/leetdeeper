import { describe, it, expect } from 'vitest'
import { characterReplacement } from './solution'

describe('characterReplacement', () => {
  it('ABAB, k=2 -> 4', () => {
    expect(characterReplacement('ABAB', 2)).toBe(4)
  })

  it('AABABBA, k=1 -> 4', () => {
    expect(characterReplacement('AABABBA', 1)).toBe(4)
  })

  it('single char, k=0 -> 1', () => {
    expect(characterReplacement('A', 0)).toBe(1)
  })

  it('all same chars -> length', () => {
    expect(characterReplacement('AAAA', 2)).toBe(4)
  })

  it('k=0, no replacements', () => {
    expect(characterReplacement('ABAB', 0)).toBe(1)
  })
})

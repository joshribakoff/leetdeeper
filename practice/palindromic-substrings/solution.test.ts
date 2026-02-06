import { describe, it, expect } from 'vitest'
import { countSubstrings } from './solution'

describe('countSubstrings', () => {
  it('abc -> 3', () => {
    // a, b, c
    expect(countSubstrings('abc')).toBe(3)
  })

  it('aaa -> 6', () => {
    // a, a, a, aa, aa, aaa
    expect(countSubstrings('aaa')).toBe(6)
  })

  it('single char -> 1', () => {
    expect(countSubstrings('a')).toBe(1)
  })

  it('empty string -> 0', () => {
    expect(countSubstrings('')).toBe(0)
  })

  it('aba -> 4', () => {
    // a, b, a, aba
    expect(countSubstrings('aba')).toBe(4)
  })
})

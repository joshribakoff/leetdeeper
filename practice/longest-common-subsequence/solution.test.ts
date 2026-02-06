import { describe, it, expect } from 'vitest'
import { longestCommonSubsequence } from './solution'

describe('Longest Common Subsequence', () => {
  it('example 1: "abcde", "ace" -> 3', () => {
    expect(longestCommonSubsequence('abcde', 'ace')).toBe(3) // "ace"
  })

  it('example 2: "abc", "abc" -> 3', () => {
    expect(longestCommonSubsequence('abc', 'abc')).toBe(3)
  })

  it('example 3: "abc", "def" -> 0', () => {
    expect(longestCommonSubsequence('abc', 'def')).toBe(0)
  })
})

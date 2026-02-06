import { describe, it, expect } from 'vitest'
import { lengthOfLongestSubstring } from './solution'

describe('lengthOfLongestSubstring', () => {
  it('abcabcbb -> 3', () => {
    expect(lengthOfLongestSubstring('abcabcbb')).toBe(3)
  })

  it('bbbbb -> 1', () => {
    expect(lengthOfLongestSubstring('bbbbb')).toBe(1)
  })

  it('pwwkew -> 3', () => {
    expect(lengthOfLongestSubstring('pwwkew')).toBe(3)
  })

  it('empty string -> 0', () => {
    expect(lengthOfLongestSubstring('')).toBe(0)
  })

  it('single char -> 1', () => {
    expect(lengthOfLongestSubstring('a')).toBe(1)
  })

  it('all unique -> length', () => {
    expect(lengthOfLongestSubstring('abcdef')).toBe(6)
  })
})

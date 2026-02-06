import { describe, it, expect } from 'vitest'
import { longestPalindrome } from './solution'

describe('longestPalindrome', () => {
  it('babad -> bab or aba', () => {
    const result = longestPalindrome('babad')
    expect(['bab', 'aba']).toContain(result)
  })

  it('cbbd -> bb', () => {
    expect(longestPalindrome('cbbd')).toBe('bb')
  })

  it('single char', () => {
    expect(longestPalindrome('a')).toBe('a')
  })

  it('two same chars', () => {
    expect(longestPalindrome('aa')).toBe('aa')
  })

  it('two different chars', () => {
    const result = longestPalindrome('ab')
    expect(['a', 'b']).toContain(result)
  })

  it('all same chars', () => {
    expect(longestPalindrome('aaaa')).toBe('aaaa')
  })
})

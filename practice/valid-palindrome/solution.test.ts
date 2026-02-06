import { describe, it, expect } from 'vitest'
import { isPalindrome } from './solution'

describe('isPalindrome', () => {
  it('"A man, a plan, a canal: Panama" -> true', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true)
  })

  it('"race a car" -> false', () => {
    expect(isPalindrome('race a car')).toBe(false)
  })

  it('empty string -> true', () => {
    expect(isPalindrome('')).toBe(true)
  })

  it('single char -> true', () => {
    expect(isPalindrome('a')).toBe(true)
  })

  it('only non-alphanumeric -> true', () => {
    expect(isPalindrome(' ')).toBe(true)
  })

  it('numbers included', () => {
    expect(isPalindrome('0P')).toBe(false)
  })
})

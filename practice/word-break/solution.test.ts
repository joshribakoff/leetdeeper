import { describe, it, expect } from 'vitest'
import { wordBreak } from './solution'

describe('Word Break', () => {
  it('example 1: "leetcode", ["leet","code"] -> true', () => {
    expect(wordBreak('leetcode', ['leet', 'code'])).toBe(true)
  })

  it('example 2: "applepenapple", ["apple","pen"] -> true', () => {
    expect(wordBreak('applepenapple', ['apple', 'pen'])).toBe(true)
  })

  it('example 3: "catsandog", ["cats","dog","sand","and","cat"] -> false', () => {
    expect(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])).toBe(false)
  })
})

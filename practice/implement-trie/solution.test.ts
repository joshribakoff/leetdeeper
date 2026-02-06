import { describe, test, expect } from 'vitest'
import { Trie } from './solution'

describe('Implement Trie', () => {
  test('example 1: insert and search', () => {
    const trie = new Trie()
    trie.insert('apple')
    expect(trie.search('apple')).toBe(true)
    expect(trie.search('app')).toBe(false)
    expect(trie.startsWith('app')).toBe(true)
    trie.insert('app')
    expect(trie.search('app')).toBe(true)
  })

  test('empty string', () => {
    const trie = new Trie()
    trie.insert('')
    expect(trie.search('')).toBe(true)
    expect(trie.startsWith('')).toBe(true)
  })

  test('multiple words', () => {
    const trie = new Trie()
    trie.insert('hello')
    trie.insert('help')
    trie.insert('world')
    expect(trie.search('hello')).toBe(true)
    expect(trie.search('help')).toBe(true)
    expect(trie.search('world')).toBe(true)
    expect(trie.search('hel')).toBe(false)
    expect(trie.startsWith('hel')).toBe(true)
    expect(trie.startsWith('wor')).toBe(true)
  })
})

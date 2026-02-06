import { describe, test, expect } from 'vitest'
import { WordDictionary } from './solution'

describe('Design Add and Search Words', () => {
  test('example 1: basic operations', () => {
    const wordDictionary = new WordDictionary()
    wordDictionary.addWord('bad')
    wordDictionary.addWord('dad')
    wordDictionary.addWord('mad')
    expect(wordDictionary.search('pad')).toBe(false)
    expect(wordDictionary.search('bad')).toBe(true)
    expect(wordDictionary.search('.ad')).toBe(true)
    expect(wordDictionary.search('b..')).toBe(true)
  })

  test('all dots', () => {
    const wordDictionary = new WordDictionary()
    wordDictionary.addWord('ab')
    expect(wordDictionary.search('..')).toBe(true)
    expect(wordDictionary.search('...')).toBe(false)
  })

  test('dot in middle', () => {
    const wordDictionary = new WordDictionary()
    wordDictionary.addWord('abc')
    expect(wordDictionary.search('a.c')).toBe(true)
    expect(wordDictionary.search('a.d')).toBe(false)
  })
})

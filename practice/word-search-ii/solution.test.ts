import { describe, test, expect } from 'vitest'
import { findWords } from './solution'

describe('Word Search II', () => {
  test('example 1', () => {
    const board = [
      ['o', 'a', 'a', 'n'],
      ['e', 't', 'a', 'e'],
      ['i', 'h', 'k', 'r'],
      ['i', 'f', 'l', 'v']
    ]
    const words = ['oath', 'pea', 'eat', 'rain']
    const result = findWords(board, words)
    expect(result.sort()).toEqual(['eat', 'oath'].sort())
  })

  test('example 2', () => {
    const board = [['a', 'b'], ['c', 'd']]
    const words = ['abcb']
    expect(findWords(board, words)).toEqual([])
  })

  test('single cell', () => {
    const board = [['a']]
    const words = ['a']
    expect(findWords(board, words)).toEqual(['a'])
  })
})

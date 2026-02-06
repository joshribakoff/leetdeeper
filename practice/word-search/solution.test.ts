import { describe, it, expect } from 'vitest'
import { exist } from './solution'

describe('exist', () => {
  const board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']]

  it('finds ABCCED', () => {
    expect(exist(board, 'ABCCED')).toBe(true)
  })

  it('finds SEE', () => {
    expect(exist(board, 'SEE')).toBe(true)
  })

  it('does not find ABCB', () => {
    expect(exist(board, 'ABCB')).toBe(false)
  })

  it('single cell match', () => {
    expect(exist([['A']], 'A')).toBe(true)
  })

  it('single cell no match', () => {
    expect(exist([['A']], 'B')).toBe(false)
  })
})

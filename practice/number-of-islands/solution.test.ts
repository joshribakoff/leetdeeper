import { describe, it, expect } from 'vitest'
import { numIslands } from './solution'

describe('Number of Islands', () => {
  it('example 1: 1 island', () => {
    const grid = [
      ['1', '1', '1', '1', '0'],
      ['1', '1', '0', '1', '0'],
      ['1', '1', '0', '0', '0'],
      ['0', '0', '0', '0', '0']
    ]
    expect(numIslands(grid)).toBe(1)
  })

  it('example 2: 3 islands', () => {
    const grid = [
      ['1', '1', '0', '0', '0'],
      ['1', '1', '0', '0', '0'],
      ['0', '0', '1', '0', '0'],
      ['0', '0', '0', '1', '1']
    ]
    expect(numIslands(grid)).toBe(3)
  })
})

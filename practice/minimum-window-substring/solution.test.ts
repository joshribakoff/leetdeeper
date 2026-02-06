import { describe, it, expect } from 'vitest'
import { minWindow } from './solution'

describe('minWindow', () => {
  it('ADOBECODEBANC, ABC -> BANC', () => {
    expect(minWindow('ADOBECODEBANC', 'ABC')).toBe('BANC')
  })

  it('a, a -> a', () => {
    expect(minWindow('a', 'a')).toBe('a')
  })

  it('a, aa -> empty (impossible)', () => {
    expect(minWindow('a', 'aa')).toBe('')
  })

  it('empty s -> empty', () => {
    expect(minWindow('', 'A')).toBe('')
  })

  it('t longer than s -> empty', () => {
    expect(minWindow('AB', 'ABC')).toBe('')
  })
})

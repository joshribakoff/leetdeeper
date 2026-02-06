import { describe, it, expect } from 'vitest'
import { isValid } from './solution'

describe('isValid', () => {
  it('() -> true', () => {
    expect(isValid('()')).toBe(true)
  })

  it('()[]{}  -> true', () => {
    expect(isValid('()[]{}')).toBe(true)
  })

  it('(] -> false', () => {
    expect(isValid('(]')).toBe(false)
  })

  it('([]) -> true', () => {
    expect(isValid('([])')).toBe(true)
  })

  it('([)] -> false', () => {
    expect(isValid('([)]')).toBe(false)
  })

  it('empty string -> true', () => {
    expect(isValid('')).toBe(true)
  })

  it('single open -> false', () => {
    expect(isValid('(')).toBe(false)
  })

  it('single close -> false', () => {
    expect(isValid(')')).toBe(false)
  })
})

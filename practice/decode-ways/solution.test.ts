import { describe, it, expect } from 'vitest'
import { numDecodings } from './solution'

describe('Decode Ways', () => {
  it('example 1: "12" -> 2', () => {
    expect(numDecodings('12')).toBe(2) // "AB" (1,2) or "L" (12)
  })

  it('example 2: "226" -> 3', () => {
    expect(numDecodings('226')).toBe(3) // "BZ", "VF", "BBF"
  })

  it('example 3: "06" -> 0', () => {
    expect(numDecodings('06')).toBe(0) // leading zero invalid
  })
})

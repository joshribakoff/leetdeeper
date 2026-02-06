import { describe, it, expect } from 'vitest'
import { encode, decode } from './solution'

describe('encode and decode', () => {
  it('encodes and decodes ["Hello","World"]', () => {
    const input = ['Hello', 'World']
    expect(decode(encode(input))).toEqual(input)
  })

  it('encodes and decodes empty array', () => {
    const input: string[] = []
    expect(decode(encode(input))).toEqual(input)
  })

  it('encodes and decodes [""]', () => {
    const input = ['']
    expect(decode(encode(input))).toEqual(input)
  })

  it('handles strings with special chars', () => {
    const input = ['a#b', 'c#d']
    expect(decode(encode(input))).toEqual(input)
  })

  it('handles strings with numbers', () => {
    const input = ['123', '456#789']
    expect(decode(encode(input))).toEqual(input)
  })

  it('handles empty strings mixed', () => {
    const input = ['', 'a', '', 'b', '']
    expect(decode(encode(input))).toEqual(input)
  })
})

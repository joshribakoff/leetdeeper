import { describe, it, expect } from 'vitest'
import { groupAnagrams } from './solution'

// Helper to compare anagram groups (order-independent)
function sortGroups(groups: string[][]): string[][] {
  return groups.map(g => [...g].sort()).sort((a, b) => a[0].localeCompare(b[0]))
}

describe('groupAnagrams', () => {
  it('groups eat, tea, tan, ate, nat, bat', () => {
    const result = groupAnagrams(['eat','tea','tan','ate','nat','bat'])
    const expected = [['bat'],['nat','tan'],['ate','eat','tea']]
    expect(sortGroups(result)).toEqual(sortGroups(expected))
  })

  it('empty string', () => {
    const result = groupAnagrams([''])
    expect(result).toEqual([['']])
  })

  it('single word', () => {
    const result = groupAnagrams(['a'])
    expect(result).toEqual([['a']])
  })

  it('no anagrams', () => {
    const result = groupAnagrams(['abc', 'def', 'ghi'])
    expect(sortGroups(result)).toEqual(sortGroups([['abc'],['def'],['ghi']]))
  })
})

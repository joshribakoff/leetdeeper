import { describe, test, expect } from 'vitest'
import { isValidBST, buildTree } from './solution'

describe('Validate Binary Search Tree', () => {
  test('example 1: [2,1,3] -> true', () => {
    const root = buildTree([2, 1, 3])
    expect(isValidBST(root)).toBe(true)
  })

  test('example 2: [5,1,4,null,null,3,6] -> false', () => {
    const root = buildTree([5, 1, 4, null, null, 3, 6])
    expect(isValidBST(root)).toBe(false)
  })

  test('single node -> true', () => {
    const root = buildTree([1])
    expect(isValidBST(root)).toBe(true)
  })

  test('equal values not allowed: [2,2,2] -> false', () => {
    const root = buildTree([2, 2, 2])
    expect(isValidBST(root)).toBe(false)
  })
})

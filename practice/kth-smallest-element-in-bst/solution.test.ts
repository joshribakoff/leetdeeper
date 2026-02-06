import { describe, test, expect } from 'vitest'
import { kthSmallest, buildTree } from './solution'

describe('Kth Smallest Element in a BST', () => {
  test('example 1: [3,1,4,null,2], k=1 -> 1', () => {
    const root = buildTree([3, 1, 4, null, 2])
    expect(kthSmallest(root, 1)).toBe(1)
  })

  test('example 2: [5,3,6,2,4,null,null,1], k=3 -> 3', () => {
    const root = buildTree([5, 3, 6, 2, 4, null, null, 1])
    expect(kthSmallest(root, 3)).toBe(3)
  })

  test('single node, k=1', () => {
    const root = buildTree([1])
    expect(kthSmallest(root, 1)).toBe(1)
  })
})

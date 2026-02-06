import { describe, test, expect } from 'vitest'
import { levelOrder, buildTree } from './solution'

describe('Binary Tree Level Order Traversal', () => {
  test('example 1: [3,9,20,null,null,15,7] -> [[3],[9,20],[15,7]]', () => {
    const root = buildTree([3, 9, 20, null, null, 15, 7])
    expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]])
  })

  test('example 2: [1] -> [[1]]', () => {
    const root = buildTree([1])
    expect(levelOrder(root)).toEqual([[1]])
  })

  test('example 3: empty tree -> []', () => {
    expect(levelOrder(null)).toEqual([])
  })
})

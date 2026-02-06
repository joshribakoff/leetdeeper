import { describe, test, expect } from 'vitest'
import { maxPathSum, buildTree } from './solution'

describe('Binary Tree Maximum Path Sum', () => {
  test('example 1: [1,2,3] -> 6', () => {
    const root = buildTree([1, 2, 3])
    expect(maxPathSum(root)).toBe(6)
  })

  test('example 2: [-10,9,20,null,null,15,7] -> 42', () => {
    const root = buildTree([-10, 9, 20, null, null, 15, 7])
    expect(maxPathSum(root)).toBe(42)
  })

  test('single node: [1] -> 1', () => {
    const root = buildTree([1])
    expect(maxPathSum(root)).toBe(1)
  })

  test('negative values: [-3] -> -3', () => {
    const root = buildTree([-3])
    expect(maxPathSum(root)).toBe(-3)
  })
})

import { describe, test, expect } from 'vitest'
import { buildTree, treeToArray } from './solution'

describe('Construct Binary Tree from Preorder and Inorder', () => {
  test('example 1: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]', () => {
    const result = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])
    expect(treeToArray(result)).toEqual([3, 9, 20, null, null, 15, 7])
  })

  test('example 2: preorder=[-1], inorder=[-1]', () => {
    const result = buildTree([-1], [-1])
    expect(treeToArray(result)).toEqual([-1])
  })

  test('empty arrays', () => {
    const result = buildTree([], [])
    expect(result).toBeNull()
  })
})

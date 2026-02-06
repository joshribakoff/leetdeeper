import { describe, test, expect } from 'vitest'
import { lowestCommonAncestor, buildTree, findNode } from './solution'

describe('Lowest Common Ancestor of a BST', () => {
  test('example 1: [6,2,8,0,4,7,9,null,null,3,5], p=2, q=8 -> 6', () => {
    const root = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5])
    const p = findNode(root, 2)!
    const q = findNode(root, 8)!
    const lca = lowestCommonAncestor(root, p, q)
    expect(lca?.val).toBe(6)
  })

  test('example 2: [6,2,8,0,4,7,9,null,null,3,5], p=2, q=4 -> 2', () => {
    const root = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5])
    const p = findNode(root, 2)!
    const q = findNode(root, 4)!
    const lca = lowestCommonAncestor(root, p, q)
    expect(lca?.val).toBe(2)
  })

  test('example 3: [2,1], p=2, q=1 -> 2', () => {
    const root = buildTree([2, 1])
    const p = findNode(root, 2)!
    const q = findNode(root, 1)!
    const lca = lowestCommonAncestor(root, p, q)
    expect(lca?.val).toBe(2)
  })
})

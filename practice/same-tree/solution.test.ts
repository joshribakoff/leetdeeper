import { describe, it, expect } from 'vitest'
import { isSameTree, TreeNode } from './solution'

describe('isSameTree', () => {
  it('[1,2,3] and [1,2,3] -> true', () => {
    const p = new TreeNode(1, new TreeNode(2), new TreeNode(3))
    const q = new TreeNode(1, new TreeNode(2), new TreeNode(3))
    expect(isSameTree(p, q)).toBe(true)
  })

  it('[1,2] and [1,null,2] -> false', () => {
    const p = new TreeNode(1, new TreeNode(2))
    const q = new TreeNode(1, null, new TreeNode(2))
    expect(isSameTree(p, q)).toBe(false)
  })

  it('[1,2,1] and [1,1,2] -> false', () => {
    const p = new TreeNode(1, new TreeNode(2), new TreeNode(1))
    const q = new TreeNode(1, new TreeNode(1), new TreeNode(2))
    expect(isSameTree(p, q)).toBe(false)
  })

  it('both null -> true', () => {
    expect(isSameTree(null, null)).toBe(true)
  })

  it('one null -> false', () => {
    expect(isSameTree(new TreeNode(1), null)).toBe(false)
    expect(isSameTree(null, new TreeNode(1))).toBe(false)
  })
})

import { describe, it, expect } from 'vitest'
import { maxDepth, TreeNode } from './solution'

describe('maxDepth', () => {
  it('tree [3,9,20,null,null,15,7] -> 3', () => {
    const root = new TreeNode(3,
      new TreeNode(9),
      new TreeNode(20, new TreeNode(15), new TreeNode(7))
    )
    expect(maxDepth(root)).toBe(3)
  })

  it('tree [1,null,2] -> 2', () => {
    const root = new TreeNode(1, null, new TreeNode(2))
    expect(maxDepth(root)).toBe(2)
  })

  it('null tree -> 0', () => {
    expect(maxDepth(null)).toBe(0)
  })

  it('single node -> 1', () => {
    expect(maxDepth(new TreeNode(1))).toBe(1)
  })

  it('left-skewed tree -> depth', () => {
    const root = new TreeNode(1, new TreeNode(2, new TreeNode(3)))
    expect(maxDepth(root)).toBe(3)
  })
})

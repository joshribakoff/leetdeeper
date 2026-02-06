import { describe, it, expect } from 'vitest'
import { invertTree, TreeNode } from './solution'

// Helper to convert tree to array (level order)
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return []
  const result: (number | null)[] = []
  const queue: (TreeNode | null)[] = [root]
  while (queue.length) {
    const node = queue.shift()
    if (node) {
      result.push(node.val)
      queue.push(node.left)
      queue.push(node.right)
    } else {
      result.push(null)
    }
  }
  // Trim trailing nulls
  while (result.length && result[result.length - 1] === null) {
    result.pop()
  }
  return result
}

describe('invertTree', () => {
  it('[4,2,7,1,3,6,9] -> [4,7,2,9,6,3,1]', () => {
    const root = new TreeNode(4,
      new TreeNode(2, new TreeNode(1), new TreeNode(3)),
      new TreeNode(7, new TreeNode(6), new TreeNode(9))
    )
    const inverted = invertTree(root)
    expect(treeToArray(inverted)).toEqual([4,7,2,9,6,3,1])
  })

  it('[2,1,3] -> [2,3,1]', () => {
    const root = new TreeNode(2, new TreeNode(1), new TreeNode(3))
    const inverted = invertTree(root)
    expect(treeToArray(inverted)).toEqual([2,3,1])
  })

  it('null -> null', () => {
    expect(invertTree(null)).toBe(null)
  })

  it('single node unchanged', () => {
    const root = new TreeNode(1)
    const inverted = invertTree(root)
    expect(treeToArray(inverted)).toEqual([1])
  })
})

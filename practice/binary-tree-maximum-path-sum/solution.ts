// LeetCode 124: Binary Tree Maximum Path Sum

/**
 * Given the root of a binary tree, return the maximum path sum. A path is any
 * sequence of nodes where each pair of adjacent nodes has an edge. The path
 * does not need to pass through the root.
 *
 * Example 1: root = [1,2,3] -> 6 (path: 2 -> 1 -> 3)
 * Example 2: root = [-10,9,20,null,null,15,7] -> 42 (path: 15 -> 20 -> 7)
 *
 * Constraints:
 * - Node values can be negative
 * - The path must contain at least one node
 */

export class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

export function maxPathSum(root: TreeNode | null): number {
  // TODO: implement
  return 0
}

// Helper: build tree from array (level-order, null for missing nodes)
export function buildTree(arr: (number | null)[]): TreeNode | null {
  if (!arr.length || arr[0] === null) return null
  const root = new TreeNode(arr[0])
  const queue: TreeNode[] = [root]
  let i = 1
  while (i < arr.length) {
    const node = queue.shift()!
    if (arr[i] !== null) {
      node.left = new TreeNode(arr[i]!)
      queue.push(node.left)
    }
    i++
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]!)
      queue.push(node.right)
    }
    i++
  }
  return root
}

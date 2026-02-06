// Invert Binary Tree - Leetcode 226
// Given the root of a binary tree, invert the tree, and return its root.

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

/**
 * Given the root of a binary tree, invert the tree and return its root.
 * Inverting means swapping every left child with its right child.
 *
 * Example 1: root = [4,2,7,1,3,6,9] -> [4,7,2,9,6,3,1]
 * Example 2: root = [2,1,3] -> [2,3,1]
 * Example 3: root = [] -> []
 */
export function invertTree(root: TreeNode | null): TreeNode | null {
  // TODO: implement
  return null
}

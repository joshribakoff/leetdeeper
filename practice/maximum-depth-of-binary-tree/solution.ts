// Maximum Depth of Binary Tree - Leetcode 104
// Given the root of a binary tree, return its maximum depth.
/**
 * Given the root of a binary tree, return its maximum depth. The maximum
 * depth is the number of nodes along the longest path from the root node
 * down to the farthest leaf node.
 *
 * Example 1: root = [3,9,20,null,null,15,7] -> 3
 * Example 2: root = [1,null,2] -> 2
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

export function maxDepth(root: TreeNode | null): number {
  // TODO: implement
  return 0
}

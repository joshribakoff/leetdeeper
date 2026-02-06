// Same Tree - Leetcode 100
// Given the roots of two binary trees, check if they are the same.

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
 * Given the roots of two binary trees p and q, check if they are the
 * same. Two trees are the same if they are structurally identical and
 * the nodes have the same values.
 *
 * Example 1: p = [1,2,3], q = [1,2,3] -> true
 * Example 2: p = [1,2], q = [1,null,2] -> false
 * Example 3: p = [1,2,1], q = [1,1,2] -> false
 */
export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  // TODO: implement
  return false
}

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

export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  // TODO: implement
  return false
}

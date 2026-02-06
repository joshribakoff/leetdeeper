// LeetCode 230: Kth Smallest Element in a BST
/**
 * Given the root of a binary search tree and an integer k, return the
 * kth smallest value (1-indexed) of all the values of the nodes in the tree.
 *
 * Example 1: root = [3,1,4,null,2], k = 1 -> 1
 * Example 2: root = [5,3,6,2,4,null,null,1], k = 3 -> 3
 *
 * Constraints:
 * - 1 <= k <= number of nodes
 * - Node values are unique
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

export function kthSmallest(root: TreeNode | null, k: number): number {
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

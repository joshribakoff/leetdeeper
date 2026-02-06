// LeetCode 235: Lowest Common Ancestor of a Binary Search Tree

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

export function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  // TODO: implement
  return null
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

// Helper: find node by value
export function findNode(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) return null
  if (root.val === val) return root
  return findNode(root.left, val) || findNode(root.right, val)
}

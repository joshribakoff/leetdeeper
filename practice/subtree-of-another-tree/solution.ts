// LeetCode 572: Subtree of Another Tree

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

export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  // TODO: implement
  return false
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

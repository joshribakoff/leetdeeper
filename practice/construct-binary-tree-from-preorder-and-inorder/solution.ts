// LeetCode 105: Construct Binary Tree from Preorder and Inorder Traversal

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

export function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // TODO: implement
  return null
}

// Helper: convert tree to array for testing
export function treeToArray(root: TreeNode | null): (number | null)[] {
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
  while (result.length && result[result.length - 1] === null) {
    result.pop()
  }
  return result
}

// LeetCode 297: Serialize and Deserialize Binary Tree

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

export function serialize(root: TreeNode | null): string {
  // TODO: implement
  return ''
}

export function deserialize(data: string): TreeNode | null {
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

// Helper: convert tree to array for comparison
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
  // Trim trailing nulls
  while (result.length && result[result.length - 1] === null) {
    result.pop()
  }
  return result
}

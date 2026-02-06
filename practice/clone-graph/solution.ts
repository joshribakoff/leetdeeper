// Clone Graph - Leetcode 133
// https://leetcode.com/problems/clone-graph/

/**
 * Given a reference to a node in a connected undirected graph, return a deep
 * copy (clone) of the graph. Each node has a val and a list of neighbors.
 *
 * Example 1: adjList = [[2,4],[1,3],[2,4],[1,3]] -> deep copy of same graph
 * Example 2: adjList = [[]] -> single node with no neighbors
 * Example 3: adjList = [] -> null (empty graph)
 *
 * Constraints:
 * - Cloned nodes must be new objects, not references to originals
 * - The graph is connected and undirected
 */

export class Node {
  val: number
  neighbors: Node[]
  constructor(val?: number, neighbors?: Node[]) {
    this.val = val === undefined ? 0 : val
    this.neighbors = neighbors === undefined ? [] : neighbors
  }
}

export function cloneGraph(node: Node | null): Node | null {
  // TODO: implement
  return null
}

import { describe, it, expect } from 'vitest'
import { cloneGraph, Node } from './solution'

function buildGraph(adjList: number[][]): Node | null {
  if (adjList.length === 0) return null
  const nodes = adjList.map((_, i) => new Node(i + 1))
  adjList.forEach((neighbors, i) => {
    nodes[i].neighbors = neighbors.map(n => nodes[n - 1])
  })
  return nodes[0]
}

function graphToAdjList(node: Node | null): number[][] {
  if (!node) return []
  const visited = new Map<number, number[]>()
  const queue = [node]
  while (queue.length > 0) {
    const curr = queue.shift()!
    if (visited.has(curr.val)) continue
    visited.set(curr.val, curr.neighbors.map(n => n.val))
    queue.push(...curr.neighbors)
  }
  return Array.from({ length: visited.size }, (_, i) => visited.get(i + 1)!)
}

describe('Clone Graph', () => {
  it('example 1: [[2,4],[1,3],[2,4],[1,3]]', () => {
    const adjList = [[2, 4], [1, 3], [2, 4], [1, 3]]
    const original = buildGraph(adjList)
    const cloned = cloneGraph(original)
    expect(graphToAdjList(cloned)).toEqual(adjList)
    expect(cloned).not.toBe(original) // different reference
  })

  it('example 2: [[]] (single node)', () => {
    const original = new Node(1)
    const cloned = cloneGraph(original)
    expect(cloned?.val).toBe(1)
    expect(cloned?.neighbors).toEqual([])
    expect(cloned).not.toBe(original)
  })

  it('example 3: [] (empty graph)', () => {
    expect(cloneGraph(null)).toBe(null)
  })
})

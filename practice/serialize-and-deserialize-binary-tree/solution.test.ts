import { describe, test, expect } from 'vitest'
import { serialize, deserialize, buildTree, treeToArray } from './solution'

describe('Serialize and Deserialize Binary Tree', () => {
  test('example 1: [1,2,3,null,null,4,5]', () => {
    const root = buildTree([1, 2, 3, null, null, 4, 5])
    const serialized = serialize(root)
    const deserialized = deserialize(serialized)
    expect(treeToArray(deserialized)).toEqual([1, 2, 3, null, null, 4, 5])
  })

  test('example 2: empty tree', () => {
    const serialized = serialize(null)
    const deserialized = deserialize(serialized)
    expect(deserialized).toBeNull()
  })

  test('single node', () => {
    const root = buildTree([1])
    const serialized = serialize(root)
    const deserialized = deserialize(serialized)
    expect(treeToArray(deserialized)).toEqual([1])
  })
})

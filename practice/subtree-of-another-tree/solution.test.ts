import { describe, test, expect } from 'vitest'
import { isSubtree, buildTree } from './solution'

describe('Subtree of Another Tree', () => {
  test('example 1: root=[3,4,5,1,2], subRoot=[4,1,2] -> true', () => {
    const root = buildTree([3, 4, 5, 1, 2])
    const subRoot = buildTree([4, 1, 2])
    expect(isSubtree(root, subRoot)).toBe(true)
  })

  test('example 2: root=[3,4,5,1,2,null,null,null,null,0], subRoot=[4,1,2] -> false', () => {
    const root = buildTree([3, 4, 5, 1, 2, null, null, null, null, 0])
    const subRoot = buildTree([4, 1, 2])
    expect(isSubtree(root, subRoot)).toBe(false)
  })

  test('null subRoot is always a subtree', () => {
    const root = buildTree([1, 2, 3])
    expect(isSubtree(root, null)).toBe(true)
  })
})

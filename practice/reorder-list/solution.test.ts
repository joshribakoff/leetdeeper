import { describe, test, expect } from 'vitest'
import { ListNode, reorderList } from './solution'

function toList(arr: number[]): ListNode | null {
  if (!arr.length) return null
  const head = new ListNode(arr[0])
  let curr = head
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i])
    curr = curr.next
  }
  return head
}

function toArray(head: ListNode | null): number[] {
  const result: number[] = []
  while (head) {
    result.push(head.val)
    head = head.next
  }
  return result
}

test('example 1: [1,2,3,4] -> [1,4,2,3]', () => {
  const head = toList([1,2,3,4])
  reorderList(head)
  expect(toArray(head)).toEqual([1,4,2,3])
})

test('example 2: [1,2,3,4,5] -> [1,5,2,4,3]', () => {
  const head = toList([1,2,3,4,5])
  reorderList(head)
  expect(toArray(head)).toEqual([1,5,2,4,3])
})

test('single node', () => {
  const head = toList([1])
  reorderList(head)
  expect(toArray(head)).toEqual([1])
})

test('two nodes', () => {
  const head = toList([1,2])
  reorderList(head)
  expect(toArray(head)).toEqual([1,2])
})

test('three nodes', () => {
  const head = toList([1,2,3])
  reorderList(head)
  expect(toArray(head)).toEqual([1,3,2])
})

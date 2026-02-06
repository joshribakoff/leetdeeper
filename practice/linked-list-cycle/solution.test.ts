import { describe, test, expect } from 'vitest'
import { ListNode, hasCycle } from './solution'

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

function createCycle(head: ListNode | null, pos: number): ListNode | null {
  if (!head || pos < 0) return head
  let tail = head
  let cycleNode: ListNode | null = null
  let idx = 0
  while (tail.next) {
    if (idx === pos) cycleNode = tail
    tail = tail.next
    idx++
  }
  if (idx === pos) cycleNode = tail
  if (cycleNode) tail.next = cycleNode
  return head
}

test('example 1: cycle at pos 1', () => {
  const head = createCycle(toList([3,2,0,-4]), 1)
  expect(hasCycle(head)).toBe(true)
})

test('example 2: cycle at pos 0', () => {
  const head = createCycle(toList([1,2]), 0)
  expect(hasCycle(head)).toBe(true)
})

test('example 3: no cycle', () => {
  expect(hasCycle(toList([1]))).toBe(false)
})

test('empty list', () => {
  expect(hasCycle(null)).toBe(false)
})

test('no cycle, multiple nodes', () => {
  expect(hasCycle(toList([1,2,3,4]))).toBe(false)
})

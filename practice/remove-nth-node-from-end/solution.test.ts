import { describe, test, expect } from 'vitest'
import { ListNode, removeNthFromEnd } from './solution'

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

test('example 1: [1,2,3,4,5] n=2 -> [1,2,3,5]', () => {
  expect(toArray(removeNthFromEnd(toList([1,2,3,4,5]), 2))).toEqual([1,2,3,5])
})

test('example 2: [1] n=1 -> []', () => {
  expect(toArray(removeNthFromEnd(toList([1]), 1))).toEqual([])
})

test('example 3: [1,2] n=1 -> [1]', () => {
  expect(toArray(removeNthFromEnd(toList([1,2]), 1))).toEqual([1])
})

test('remove first (from end)', () => {
  expect(toArray(removeNthFromEnd(toList([1,2]), 2))).toEqual([2])
})

test('remove middle', () => {
  expect(toArray(removeNthFromEnd(toList([1,2,3]), 2))).toEqual([1,3])
})

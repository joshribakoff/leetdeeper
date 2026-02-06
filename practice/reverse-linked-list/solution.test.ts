import { describe, test, expect } from 'vitest'
import { ListNode, reverseList } from './solution'

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

test('example 1: [1,2,3,4,5] -> [5,4,3,2,1]', () => {
  expect(toArray(reverseList(toList([1,2,3,4,5])))).toEqual([5,4,3,2,1])
})

test('example 2: [1,2] -> [2,1]', () => {
  expect(toArray(reverseList(toList([1,2])))).toEqual([2,1])
})

test('empty list', () => {
  expect(reverseList(null)).toBeNull()
})

test('single node', () => {
  expect(toArray(reverseList(toList([1])))).toEqual([1])
})

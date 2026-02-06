import { describe, test, expect } from 'vitest'
import { ListNode, mergeTwoLists } from './solution'

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

test('example 1: [1,2,4] + [1,3,4] -> [1,1,2,3,4,4]', () => {
  expect(toArray(mergeTwoLists(toList([1,2,4]), toList([1,3,4])))).toEqual([1,1,2,3,4,4])
})

test('example 2: [] + [] -> []', () => {
  expect(toArray(mergeTwoLists(null, null))).toEqual([])
})

test('example 3: [] + [0] -> [0]', () => {
  expect(toArray(mergeTwoLists(null, toList([0])))).toEqual([0])
})

test('first list empty', () => {
  expect(toArray(mergeTwoLists(null, toList([1,2,3])))).toEqual([1,2,3])
})

test('second list empty', () => {
  expect(toArray(mergeTwoLists(toList([1,2,3]), null))).toEqual([1,2,3])
})

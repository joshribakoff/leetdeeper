import { describe, test, expect } from 'vitest'
import { ListNode, mergeKLists } from './solution'

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

test('example 1: [[1,4,5],[1,3,4],[2,6]]', () => {
  const lists = [[1,4,5],[1,3,4],[2,6]].map(toList)
  expect(toArray(mergeKLists(lists))).toEqual([1,1,2,3,4,4,5,6])
})

test('example 2: empty array', () => {
  expect(toArray(mergeKLists([]))).toEqual([])
})

test('example 3: [[]]', () => {
  expect(toArray(mergeKLists([null]))).toEqual([])
})

test('single list', () => {
  expect(toArray(mergeKLists([toList([1,2,3])]))).toEqual([1,2,3])
})

test('two lists', () => {
  expect(toArray(mergeKLists([toList([1,3]), toList([2,4])]))).toEqual([1,2,3,4])
})

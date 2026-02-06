// LeetCode 23: Merge K Sorted Lists
// Merge k sorted linked lists into one sorted list.
/**
 * Given an array of k linked lists, each sorted in ascending order,
 * merge all the linked lists into one sorted linked list and return it.
 *
 * Example 1: lists = [[1,4,5],[1,3,4],[2,6]] -> [1,1,2,3,4,4,5,6]
 * Example 2: lists = [] -> []
 * Example 3: lists = [[]] -> []
 */

export class ListNode {
  val: number
  next: ListNode | null
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val
    this.next = next
  }
}

export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  // TODO: implement
  return null
}

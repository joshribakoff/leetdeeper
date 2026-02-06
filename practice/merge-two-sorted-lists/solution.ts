// LeetCode 21: Merge Two Sorted Lists
// Merge two sorted linked lists into one sorted list.
/**
 * Given the heads of two sorted linked lists, merge them into one sorted
 * list by splicing together the nodes from both lists. Return the head
 * of the merged linked list.
 *
 * Example 1: list1 = [1,2,4], list2 = [1,3,4] -> [1,1,2,3,4,4]
 * Example 2: list1 = [], list2 = [] -> []
 * Example 3: list1 = [], list2 = [0] -> [0]
 */

export class ListNode {
  val: number
  next: ListNode | null
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val
    this.next = next
  }
}

export function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // TODO: implement
  return null
}

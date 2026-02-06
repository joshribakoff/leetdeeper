// LeetCode 19: Remove Nth Node From End of List
// Remove the nth node from the end and return the head.

export class ListNode {
  val: number
  next: ListNode | null
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val
    this.next = next
  }
}

/**
 * Given the head of a linked list, remove the nth node from the end
 * of the list and return its head.
 *
 * Example 1: [1,2,3,4,5], n=2 -> [1,2,3,5]
 * Example 2: [1], n=1 -> []
 * Example 3: [1,2], n=1 -> [1]
 *
 * Constraints:
 * - 1 <= n <= number of nodes
 */
export function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // TODO: implement
  return null
}

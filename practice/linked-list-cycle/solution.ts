// LeetCode 141: Linked List Cycle
// Determine if a linked list has a cycle.
/**
 * Given head, the head of a linked list, determine if the linked list
 * has a cycle in it. A cycle exists if some node can be reached again
 * by continuously following the next pointer.
 *
 * Example 1: head = [3,2,0,-4], pos = 1 -> true (tail connects to node index 1)
 * Example 2: head = [1,2], pos = 0 -> true (tail connects to node index 0)
 * Example 3: head = [1] -> false
 *
 * Constraints:
 * - Use O(1) memory
 */

export class ListNode {
  val: number
  next: ListNode | null
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val
    this.next = next
  }
}

export function hasCycle(head: ListNode | null): boolean {
  // TODO: implement
  return false
}

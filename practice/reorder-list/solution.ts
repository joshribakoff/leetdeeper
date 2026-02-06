// LeetCode 143: Reorder List
// Reorder list from L0->L1->...->Ln to L0->Ln->L1->Ln-1->...

export class ListNode {
  val: number
  next: ListNode | null
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val
    this.next = next
  }
}

/**
 * Given the head of a singly linked list L0->L1->...->Ln-1->Ln,
 * reorder it to L0->Ln->L1->Ln-1->L2->Ln-2->... in-place.
 *
 * Example 1: [1,2,3,4] -> [1,4,2,3]
 * Example 2: [1,2,3,4,5] -> [1,5,2,4,3]
 */
export function reorderList(head: ListNode | null): void {
  // TODO: implement (modify in-place)
}

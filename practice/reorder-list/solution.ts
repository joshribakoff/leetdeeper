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

export function reorderList(head: ListNode | null): void {
  // TODO: implement (modify in-place)
}

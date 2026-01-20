# Algorithm Intuitions

## Binary Search

**Core intuition**: Eliminate half the search space each step. O(log n).

- [ ] **Classic** - Find target in sorted array. Check middle, eliminate the half that can't contain target.
  - [ ] **Ascending** - Lowest values are on the left. If middle < target, left half is all too small—throw it away, search right. If middle > target, right half is all too big—throw it away, search left.
  - [ ] **Descending** - Highest values are on the left. If middle < target, right half is all too small—throw it away, search left. If middle > target, left half is all too big—throw it away, search right.
- [ ] **Search on Answer** - Construct search space from constraints. Feasibility check is monotonic.
- [ ] **Find Boundary** - First/last occurrence, insertion point. Where condition flips.
- [ ] **Rotated Array** - Two sorted halves. Determine which half, then narrow.
- [ ] **Peak Finding** - Local max in unsorted array. Move toward the peak.

## Sliding Window

**Core insight**: Once you find a lower price, older higher prices are never useful—forget them.

- [ ] **Buy/Sell Stock (Brute Force)** - O(n²). Check all buy/sell pairs. Redundant: re-checks buy points already proven worse.
- [ ] **Buy/Sell Stock (Two Pointers)** - O(n). l=buy, r=sell. r walks forward, l jumps when cheaper price found. Stores indices—use if you need to return which days.
- [ ] **Buy/Sell Stock (Track Min)** - O(n). Track min value seen, compute profit each step. Stores just the value—use when you only need the profit.

**Meta**: Track only what the problem asks for. Indices vs values = different state, different capabilities.

## Sorting

- [ ] **Quicksort** - Pick pivot, partition (smaller left, larger right), recurse on halves. O(n log n) average. Vanilla uses last element as pivot; median-of-three avoids O(n²) on sorted input. Understood, not yet implemented.

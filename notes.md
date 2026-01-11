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

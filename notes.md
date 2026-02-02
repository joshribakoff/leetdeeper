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

## 1-D Dynamic Programming

- [ ] **Longest Increasing Subsequence** - Brute force checks all 2ⁿ subsequences (include/skip each element), verify each is increasing → O(n × 2ⁿ). DP works backwards asking "longest increasing subsequence starting at i?" Always at least 1 (element itself). Loop j through later positions (already cached since we're going backwards)—if nums[i] < nums[j], can extend with LIS[j]. → O(n²).

- [ ] **Word Break** - Can string be segmented into dictionary words?

  **Core approach**: Dictionary as hash set. For each word in dict, check if it matches prefix of remaining string. If yes, recurse on remainder. Base case: empty string = success.

  **Why not check every position?** You already know word lengths—jump directly to valid split points instead of O(n²) character-by-character scanning.

  **Where do overlapping subproblems come from?** Overlapping words in the dictionary—multiple word combinations that cover the same prefix. E.g., "pineapple" vs "pine" + "apple" both reach index 9. Without such overlap, only one path through the string exists and there's nothing to memoize.

## 2-D Dynamic Programming

- [ ] **Longest Common Subsequence** - Compare two strings. Three choices at each step:
  1. **Match** (chars equal) → take both, advance both pointers (diagonal ↘)
  2. **Skip from text1** → advance i only (down ↓)
  3. **Skip from text2** → advance j only (right →)

  **Why 2D?** State is fully described by two indices (i, j) = "where am I in each string?" That's n × m unique states → 2D grid. The naive DFS has exponential branching from revisiting the same (i, j) through different paths. Memoization collapses this to O(n × m).

  **Grid intuition**: Each cell answers "LCS of remaining substrings starting at i and j." Diagonal = happy path where chars align. Down/right = "try skipping one" branches. The zigzag through the grid is like zippering two pointers through the strings.

  **Space optimization**: Each row only depends on the previous row—don't need full history, just the last layer → O(min(n, m)) space.

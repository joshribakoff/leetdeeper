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

## Backtracking

- [ ] **Combination Sum** - Find all combinations that sum to target. Can reuse elements.

  **Two choices at each step**: Include current number (stay at same index, can reuse) or skip it (advance index, can't go back).

  **Base cases**: Success when total equals target. Failure when total exceeds target or index out of bounds.

  **How duplicates are avoided**: Index only moves forward. Once you skip a number, you can't return to it. This enforces an ordering—`[2,2,3]` is possible but `[3,2,2]` is not.

  **Note**: This problem guarantees distinct candidates. Combination Sum II (LC 40) has duplicates and requires extra handling.

  **Sorting optimization**: Sort candidates first. When `current_sum + candidates[i] > target`, break early—all subsequent candidates are larger, no point exploring.

## 1-D Dynamic Programming

- [ ] **Longest Increasing Subsequence** - Brute force checks all 2ⁿ subsequences (include/skip each element), verify each is increasing → O(n × 2ⁿ). DP works backwards asking "longest increasing subsequence starting at i?" Always at least 1 (element itself). Loop j through later positions (already cached since we're going backwards)—if nums[i] < nums[j], can extend with LIS[j]. → O(n²).

- [ ] **Word Break** - Can string be segmented into dictionary words?

  **Core approach**: Dictionary as hash set. For each word in dict, check if it matches prefix of remaining string. If yes, recurse on remainder. Base case: empty string = success.

  **Why not check every position?** You already know word lengths—jump directly to valid split points instead of O(n²) character-by-character scanning.

  **Where do overlapping subproblems come from?** Overlapping words in the dictionary—multiple word combinations that cover the same prefix. E.g., "pineapple" vs "pine" + "apple" both reach index 9. Without such overlap, only one path through the string exists and there's nothing to memoize.

- [ ] **House Robber** - Max money from non-adjacent houses.

  **Two choices at each house**: Take current value (must skip next house) or skip it (can take next). Return max of both.

  **Recurrence**: `dp[i] = max(nums[i] + dp[i+2], dp[i+1])`

  **Overlapping subproblems**: Same index reachable through multiple paths (e.g., skip-skip vs take arrives at same position). Memoize or compute bottom-up.

- [ ] **House Robber II** - Circular variant (first and last adjacent).

  **Reduction**: Run House Robber I twice—once excluding first house, once excluding last. Take max. Both O(n), simpler than tracking "took first?" flag.

## 2-D Dynamic Programming

- [ ] **Longest Common Subsequence** - Compare two strings. Three choices at each step:
  1. **Match** (chars equal) → take both, advance both pointers (diagonal ↘)
  2. **Skip from text1** → advance i only (down ↓)
  3. **Skip from text2** → advance j only (right →)

  **Why 2D?** State is fully described by two indices (i, j) = "where am I in each string?" That's n × m unique states → 2D grid. The naive DFS has exponential branching from revisiting the same (i, j) through different paths. Memoization collapses this to O(n × m).

  **Grid intuition**: Each cell answers "LCS of remaining substrings starting at i and j." Diagonal = happy path where chars align. Down/right = "try skipping one" branches. The zigzag through the grid is like zippering two pointers through the strings.

  **Space optimization**: Each row only depends on the previous row—don't need full history, just the last layer → O(min(n, m)) space.

## Graphs

- [ ] **Clone Graph** - Deep copy a graph with cycles.

  **Core insight**: DFS would cycle (bidirectional links), so use a hashmap that serves double duty: break cycles AND store old→new node mapping. When revisiting a node, return the already-created clone.

  **Key detail**: Store clone in map BEFORE recursing into neighbors, otherwise infinite loop when neighbor points back.

- [ ] **Course Schedule** - Can you finish all courses given prerequisites? Cycle detection.

  **Setup**: Build adjacency list `prereq_map[course] = [prerequisites]`. No single root—loop over every course, DFS each.

  **Cycle detection**: Track current DFS path (not just global visited). Reaching a node twice via different paths is fine—only a cycle if same path.

  **Optimization**: After verifying a course is acyclic, set `prereq_map[course] = []`. Future DFS calls return immediately—no re-traversal.

## Intervals

- [ ] **Insert Interval** - Insert new interval into sorted list, merging overlaps.

  **Single loop with if/elif/else**:
  ```
  for each interval i:
      if new.end < i.start       → new strictly BEFORE i (insert new, return rest)
      elif new.start > i.end     → new strictly AFTER i (add i to result)
      else                       → overlap (merge into new)
  append new at end
  ```

  **Intuition**: Don't enumerate the six overlap cases. The else branch catches them by elimination—anything not strictly before and not strictly after must overlap.

## Matrix

- [ ] **Rotate Image** - Rotate matrix 90° clockwise in-place.

  **4-way cycle swap** (NeetCode approach): Process entire edges, not individual corners. Each iteration of `i` grabs 4 cells in corresponding positions on all 4 edges and rotates them:

  - Left col (bottom→top) fills Top row (left→right)
  - Bottom row (right→left) fills Left col (bottom→top)
  - Right col (top→bottom) fills Bottom row (right→left)
  - Saved top row cell fills Right col (top→bottom)

  The `i` offset walks along each edge simultaneously. `+i` when walking in positive direction (right/down), `-i` when walking negative (left/up). Outer loop shrinks the box inward one layer at a time.

  **Simpler approach**: Transpose (swap across diagonal) + reverse each row. Two simple loops, easier to memorize and implement.

  **NeetCode's framing pitfall**: He describes it as "move bottom-right to bottom-left" — individual cell transfers. But you're actually processing entire edges. Thinking edge-by-edge makes the `i` offset intuitive instead of mysterious.

## Trees

- [ ] **Invert Binary Tree** - Swap every node's left and right children.

  **Don't reach down two levels.** The temptation is to swap `left.left` with `right.right` — that's wrong. Each node only swaps its own two direct children. Recursion handles the rest.

  **Traversal order matters**: Pre-order and post-order both work. **In-order breaks** — you recurse left (inverts it), then swap (old left is now right), then recurse "right" which is the subtree you already inverted. One side processed twice, the other zero.

- [ ] **Binary Tree Maximum Path Sum** - Find max sum path in a binary tree (path doesn't have to go through root).

  **Two different things computed simultaneously**: At each node, you *return* the best single-path going up (to your parent), but you *track* the best split-path through you (left + node + right) as a global max. The return value and the answer are different quantities.

  **Why return only one side?** A path can't fork. If you return left + node + right to your parent, the parent would create a path that branches — that's not a valid path. So you pick the better side.

## Stack

- [ ] **Valid Parentheses** - Match opening/closing brackets.

  **Map direction matters**: Map `closing -> opening` (not vice versa). Push opening brackets onto the stack. When you encounter a closing bracket, look it up in the map to get its matching opening bracket, then check if that matches the top of the stack. If not, the brackets are mismatched.

  **Why this direction?** You're always asking "does this closing bracket match what I'm expecting?" The stack holds what you're expecting (opening brackets in encounter order), the map translates what you're seeing (closing brackets) into what you should expect.

## Greedy

- [ ] **Jump Game** - Can you reach the last index? Each position has a max jump length.

  **Why not backtracking?** Problem asks "is it possible?" not "what's the path?" Don't need to track which jumps you take—just what's reachable.

  **Greedy insight**: Visit every index left to right. Track `max_reachable` = max reachable position. At each index, update max_reachable = max(max_reachable, i + nums[i]).

  **Key observations**:
  - Don't actually "jump"—just update state tracking the frontier
  - Zeros don't extend reach, but if we've already calculated we can jump past, keep going
  - Interim positions might extend reach further than earlier ones
  - **Failure case**: if we reach an index beyond our max_reachable, there's a gap we can't cross

  **Complexity**: O(n) single pass vs O(n²) DP. Greedy works here because we only care about possibility, not the path.

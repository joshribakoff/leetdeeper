# Sweep Line (Line Sweep / Difference Array)

A technique for answering questions about overlapping intervals without checking every interval for every query.

## Core Idea

Instead of storing intervals as ranges, convert them into **events**: mark +1 where an interval starts and -1 where it ends. Then a **prefix sum** (running total) over those events tells you how many intervals are active at any point.

## The Event Array Approach

Given intervals like `[1,4], [2,6], [3,5]`:

```
Index:  0  1  2  3  4  5  6
Events: 0 +1 +1 +1 -1 -1 -1
Prefix: 0  1  2  3  2  1  0
```

The prefix sum at any index = number of active intervals at that point.

**Steps:**
1. Create an array of zeros (size = max endpoint + 1)
2. For each interval `[start, end]`: `events[start] += 1`, `events[end + 1] -= 1`
3. Prefix sum the events array
4. Answer queries by reading the prefix sum at that index

**Time:** O(n + m) where n = intervals, m = range size
**Space:** O(m)

## Variants

### Hash Map (when range is sparse)
If endpoints are huge (e.g. 10⁹) but you only have a few intervals, don't allocate a giant array. Use a hash map keyed by time:

```python
events = defaultdict(int)
for start, end in intervals:
    events[start] += 1
    events[end + 1] -= 1

# Sort keys, then prefix sum
for t in sorted(events):
    count += events[t]
```

### List of Tuples (explicit events)
Instead of a map, create tuples and sort:

```python
events = []
for start, end in intervals:
    events.append((start, +1))   # interval opens
    events.append((end + 1, -1)) # interval closes

events.sort()
count = 0
for time, delta in events:
    count += delta
    # count = active intervals at this time
```

**When ties matter:** If a close and open happen at the same time, sort closes before opens if you want non-overlapping at boundaries. Sort opens before closes if endpoints are inclusive.

### Difference Array (range updates in O(1))
Same principle applied to an array where you need to add a value across a range:

```python
# Add +val to all indices in [l, r]
diff[l] += val
diff[r + 1] -= val
# Prefix sum to reconstruct
```

This is the same +1/-1 idea generalized to arbitrary values.

## Classic Problems

| Problem | What you sweep | What +1/-1 tracks |
|---------|---------------|-------------------|
| Meeting Rooms II (LC 253) | Time | Rooms in use |
| Number of Flowers in Full Bloom (LC 2251) | Time | Flowers blooming |
| Car Pooling (LC 1094) | Locations | Passengers on board |
| Maximum Population Year (LC 1854) | Years | People alive |
| Range Addition (LC 370) | Array indices | Accumulated additions |

## When Sweep Line vs. Other Approaches

- **Sweep line**: "How many intervals overlap at point X?" or "What's the max overlap?"
- **Sorting + greedy**: "Can I fit all intervals?" (Meeting Rooms I)
- **Sorting + heap**: "What's the minimum-length interval containing X?" (LC 1851) — need to track and discard specific intervals, not just count
- **Merge intervals**: "Combine overlapping intervals into one" — different goal entirely

## Key Insight

The sweep line converts a 2D problem (intervals with start AND end) into a 1D problem (events on a timeline). The prefix sum reconstructs the information you need. This is why it's O(n) instead of O(n²) — you process each interval exactly twice (one +1, one -1) regardless of how many other intervals exist.

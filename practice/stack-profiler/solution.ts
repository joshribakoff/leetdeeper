/**
 * Stage 1: Stack Sample Counting
 *
 * A CPU profiler samples the call stack at regular intervals.
 * Each sample is an array of function names from bottom (caller)
 * to top (currently executing).
 *
 * Given an array of stack samples, return a Map of function name
 * to an object containing:
 *   - total: number of samples the function appears in (anywhere in stack)
 *   - self: number of samples where the function is at the TOP of the stack
 *
 * Example:
 *   samples = [
 *     ["main", "foo", "bar"],   // bar is executing, foo called bar, main called foo
 *     ["main", "foo", "bar"],
 *     ["main", "foo"],          // bar returned, foo is now executing
 *     ["main", "baz"],          // foo returned, main called baz
 *   ]
 *
 *   Result:
 *     main -> { total: 4, self: 0 }
 *     foo  -> { total: 3, self: 1 }
 *     bar  -> { total: 2, self: 2 }
 *     baz  -> { total: 1, self: 1 }
 */

export interface ProfileEntry {
  total: number;
  self: number;
}

export function profileStacks(samples: string[][]): Map<string, ProfileEntry> {
  const map = new Map();
  for (const sample of samples) {
    for (const frame of new Set(sample)) {
      const m = map.get(frame) ?? { total: 0, self: 0 };
      m.total++;
      if (sample[sample.length - 1] == frame) m.self++;
      map.set(frame, m);
    }
  }
  return map;
}

/**
 * Stage 3: Flame Graph Spans
 *
 * A flame graph visualizes profiler data as stacked rectangles.
 * Each rectangle (span) represents a function that was on the call
 * stack for a continuous period of time.
 *
 * Given an array of timestamped stack samples, produce an array of
 * spans. Each span has:
 *   - name: function name
 *   - start: timestamp when this function appeared on the stack
 *   - end: timestamp when it left the stack
 *   - depth: position in the stack (0 = bottom)
 *
 * Return spans sorted by start time, then by depth.
 */

export interface Span {
  name: string;
  start: number;
  end: number;
  depth: number;
}

export interface TimedSample {
  time: number;
  stack: string[];
}

export function buildFlameSpans(samples: TimedSample[]): Span[] {
  const spans = [];
  // create a stack
  const s = [];
  // loop over samples
  for (let i = 0; i <= samples.length; i++) {
    // compare i and i-1
    const diff = diffStacks(
      samples[i - 1]?.stack ?? [],
      samples[i]?.stack ?? [],
    );
    // pop all closed, emit Spans
    for (let j = diff.exited.length - 1; j >= 0; j--) {
      const depth = s.length - 1;
      const [name, start] = s.pop();
      const span = {
        name,
        start,
        end: samples[i].time,
        depth,
      };
      spans.push(span);
    }
    for (let j = 0; j < diff.entered.length; j++) {
      s.push([diff.entered[j], samples[i].time]);
    }
    // push all entered + time (tuples?)
  }
  return spans.sort((a, b) => {
    const diff = a.start - b.start;
    if (diff === 0) return a.depth - b.depth;
    return diff;
  });
}

/**
 * Stage 4: Call Tree Construction
 *
 * Profiler UIs show a "call tree" — a hierarchy where each node
 * represents a function, with its children being the functions
 * it called. Each node tracks:
 *   - name: function name
 *   - totalTime: wall time this function was on the stack (end - start)
 *   - selfTime: time spent in this function itself, excluding children
 *   - children: nested CallTreeNode[]
 *
 * Given a flat array of Spans (from Stage 3), build the call tree.
 * Return an array of root nodes (depth 0).
 * Children should be in chronological order (by start time).
 *
 * Example:
 *   spans = [
 *     { name: 'main', start: 0, end: 10, depth: 0 },
 *     { name: 'foo', start: 0, end: 5, depth: 1 },
 *     { name: 'bar', start: 5, end: 10, depth: 1 },
 *   ]
 *
 *   Result: [{
 *     name: 'main', totalTime: 10, selfTime: 0,
 *     children: [
 *       { name: 'foo', totalTime: 5, selfTime: 5, children: [] },
 *       { name: 'bar', totalTime: 5, selfTime: 5, children: [] },
 *     ]
 *   }]
 */

export interface CallTreeNode {
  name: string;
  totalTime: number;
  selfTime: number;
  children: CallTreeNode[];
}

export function buildCallTree(spans: Span[]): CallTreeNode[] {
  const dfs = (
    depth: number = 0,
    start: number = 0,
    end: number = Infinity,
  ) => {
    const result: CallTreeNode[] = [];
    for (const span of spans.filter(
      (s) => s.depth == depth && s.start >= start && s.end <= end,
    )) {
      const children = dfs(depth + 1, span.start, span.end);
      let childTime = 0;
      for (const child of children) {
        childTime += child.totalTime;
      }
      result.push({
        name: span.name,
        totalTime: span.end - span.start,
        selfTime: span.end - span.start - childTime,
        children,
      });
    }
    return result;
  };
  return dfs();
}

export function diffStacks(
  prev: string[],
  curr: string[],
): { entered: string[]; exited: string[] } {
  let lcp = 0;
  while (lcp < Math.min(prev.length, curr.length) && prev[lcp] == curr[lcp]) {
    lcp++;
  }
  const r = { entered: [], exited: [] };
  for (let i = prev.length - 1; i >= lcp; i--) {
    r.exited.push(prev[i]);
  }
  for (let i = lcp; i < curr.length; i++) {
    r.entered.push(curr[i]);
  }
  return r;
}

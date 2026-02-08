import { describe, it, expect } from 'vitest'
import { profileStacks, diffStacks, buildFlameSpans, buildCallTree } from './solution'

describe('Stage 1: Stack Sample Counting', () => {
  it('basic example', () => {
    const samples = [
      ['main', 'foo', 'bar'],
      ['main', 'foo', 'bar'],
      ['main', 'foo'],
      ['main', 'baz'],
    ]
    const result = profileStacks(samples)
    expect(result.get('main')).toEqual({ total: 4, self: 0 })
    expect(result.get('foo')).toEqual({ total: 3, self: 1 })
    expect(result.get('bar')).toEqual({ total: 2, self: 2 })
    expect(result.get('baz')).toEqual({ total: 1, self: 1 })
  })

  it('empty samples', () => {
    expect(profileStacks([])).toEqual(new Map())
  })

  it('single function', () => {
    const samples = [['main'], ['main'], ['main']]
    const result = profileStacks(samples)
    expect(result.get('main')).toEqual({ total: 3, self: 3 })
  })

  it('function appears at different stack depths', () => {
    const samples = [
      ['a', 'b', 'c'],
      ['a', 'c'],
      ['c'],
    ]
    const result = profileStacks(samples)
    expect(result.get('a')).toEqual({ total: 2, self: 0 })
    expect(result.get('b')).toEqual({ total: 1, self: 0 })
    expect(result.get('c')).toEqual({ total: 3, self: 3 })
  })

  it('recursive function counts once per sample', () => {
    const samples = [
      ['main', 'fib', 'fib', 'fib'],
      ['main', 'fib', 'fib'],
      ['main', 'fib'],
    ]
    const result = profileStacks(samples)
    expect(result.get('fib')?.total).toBe(3)
    expect(result.get('fib')?.self).toBe(3)
    expect(result.get('main')).toEqual({ total: 3, self: 0 })
  })
})

describe('Stage 2: Stack Diffing', () => {
  /**
   * Given two consecutive stack samples (prev and curr), determine
   * which frames were:
   *   - entered: in curr but not in the matching prefix of prev
   *   - exited: in prev but not in the matching prefix of curr
   *
   * Compare from the bottom up. The "common prefix" is the shared
   * base of the call stack. Everything above the divergence point
   * in prev was exited, everything above it in curr was entered.
   *
   * Example:
   *   prev: ["main", "foo", "bar"]
   *   curr: ["main", "foo", "baz", "qux"]
   *
   *   Common prefix: ["main", "foo"]
   *   Exited: ["bar"]           (was above the prefix in prev)
   *   Entered: ["baz", "qux"]  (new above the prefix in curr)
   *
   * Return { entered: string[], exited: string[] }
   * exited should be in pop order (top of stack first)
   * entered should be in push order (bottom first)
   */

  it('basic divergence', () => {
    const result = diffStacks(
      ['main', 'foo', 'bar'],
      ['main', 'foo', 'baz', 'qux'],
    )
    expect(result.exited).toEqual(['bar'])
    expect(result.entered).toEqual(['baz', 'qux'])
  })

  it('deeper call (nothing exited)', () => {
    const result = diffStacks(
      ['main', 'foo'],
      ['main', 'foo', 'bar'],
    )
    expect(result.exited).toEqual([])
    expect(result.entered).toEqual(['bar'])
  })

  it('return from call (nothing entered)', () => {
    const result = diffStacks(
      ['main', 'foo', 'bar'],
      ['main', 'foo'],
    )
    expect(result.exited).toEqual(['bar'])
    expect(result.entered).toEqual([])
  })

  it('completely different stacks', () => {
    const result = diffStacks(
      ['main', 'foo'],
      ['init', 'setup'],
    )
    expect(result.exited).toEqual(['foo', 'main'])
    expect(result.entered).toEqual(['init', 'setup'])
  })

  it('identical stacks', () => {
    const result = diffStacks(
      ['main', 'foo'],
      ['main', 'foo'],
    )
    expect(result.exited).toEqual([])
    expect(result.entered).toEqual([])
  })

  it('empty prev (startup)', () => {
    const result = diffStacks(
      [],
      ['main', 'foo'],
    )
    expect(result.exited).toEqual([])
    expect(result.entered).toEqual(['main', 'foo'])
  })

  it('empty curr (shutdown)', () => {
    const result = diffStacks(
      ['main', 'foo'],
      [],
    )
    expect(result.exited).toEqual(['foo', 'main'])
    expect(result.entered).toEqual([])
  })
})

describe('Stage 3: Flame Graph Spans', () => {
  it('single function lifespan', () => {
    const spans = buildFlameSpans([
      { time: 0, stack: ['main'] },
      { time: 10, stack: [] },
    ])
    expect(spans).toEqual([
      { name: 'main', start: 0, end: 10, depth: 0 },
    ])
  })

  it('nested calls', () => {
    const spans = buildFlameSpans([
      { time: 0, stack: ['main', 'foo'] },
      { time: 5, stack: ['main'] },
      { time: 10, stack: [] },
    ])
    expect(spans).toEqual([
      { name: 'main', start: 0, end: 10, depth: 0 },
      { name: 'foo', start: 0, end: 5, depth: 1 },
    ])
  })

  it('sequential calls at same depth', () => {
    const spans = buildFlameSpans([
      { time: 0, stack: ['main', 'foo'] },
      { time: 5, stack: ['main', 'bar'] },
      { time: 10, stack: [] },
    ])
    expect(spans).toEqual([
      { name: 'main', start: 0, end: 10, depth: 0 },
      { name: 'foo', start: 0, end: 5, depth: 1 },
      { name: 'bar', start: 5, end: 10, depth: 1 },
    ])
  })

  it('function called twice produces two spans', () => {
    const spans = buildFlameSpans([
      { time: 0, stack: ['main', 'foo'] },
      { time: 3, stack: ['main', 'bar'] },
      { time: 7, stack: ['main', 'foo'] },
      { time: 10, stack: [] },
    ])
    expect(spans).toEqual([
      { name: 'main', start: 0, end: 10, depth: 0 },
      { name: 'foo', start: 0, end: 3, depth: 1 },
      { name: 'bar', start: 3, end: 7, depth: 1 },
      { name: 'foo', start: 7, end: 10, depth: 1 },
    ])
  })

  it('deep call stack', () => {
    const spans = buildFlameSpans([
      { time: 0, stack: ['a', 'b', 'c', 'd'] },
      { time: 5, stack: [] },
    ])
    expect(spans).toEqual([
      { name: 'a', start: 0, end: 5, depth: 0 },
      { name: 'b', start: 0, end: 5, depth: 1 },
      { name: 'c', start: 0, end: 5, depth: 2 },
      { name: 'd', start: 0, end: 5, depth: 3 },
    ])
  })

  it('empty samples', () => {
    expect(buildFlameSpans([])).toEqual([])
  })

  it('full scenario from Stage 1', () => {
    const spans = buildFlameSpans([
      { time: 0, stack: ['main', 'foo', 'bar'] },
      { time: 10, stack: ['main', 'foo', 'bar'] },
      { time: 20, stack: ['main', 'foo'] },
      { time: 30, stack: ['main', 'baz'] },
      { time: 40, stack: [] },
    ])
    expect(spans).toEqual([
      { name: 'main', start: 0, end: 40, depth: 0 },
      { name: 'foo', start: 0, end: 30, depth: 1 },
      { name: 'bar', start: 0, end: 20, depth: 2 },
      { name: 'baz', start: 30, end: 40, depth: 1 },
    ])
  })
})

describe('Stage 4: Call Tree Construction', () => {
  it('empty spans', () => {
    expect(buildCallTree([])).toEqual([])
  })

  it('single root', () => {
    expect(buildCallTree([
      { name: 'main', start: 0, end: 10, depth: 0 },
    ])).toEqual([
      { name: 'main', totalTime: 10, selfTime: 10, children: [] },
    ])
  })

  it('parent with one child', () => {
    expect(buildCallTree([
      { name: 'main', start: 0, end: 10, depth: 0 },
      { name: 'foo', start: 0, end: 10, depth: 1 },
    ])).toEqual([{
      name: 'main', totalTime: 10, selfTime: 0,
      children: [
        { name: 'foo', totalTime: 10, selfTime: 10, children: [] },
      ],
    }])
  })

  it('parent with two sequential children', () => {
    expect(buildCallTree([
      { name: 'main', start: 0, end: 10, depth: 0 },
      { name: 'foo', start: 0, end: 5, depth: 1 },
      { name: 'bar', start: 5, end: 10, depth: 1 },
    ])).toEqual([{
      name: 'main', totalTime: 10, selfTime: 0,
      children: [
        { name: 'foo', totalTime: 5, selfTime: 5, children: [] },
        { name: 'bar', totalTime: 5, selfTime: 5, children: [] },
      ],
    }])
  })

  it('parent with self time (gaps between children)', () => {
    expect(buildCallTree([
      { name: 'main', start: 0, end: 10, depth: 0 },
      { name: 'foo', start: 2, end: 5, depth: 1 },
      { name: 'bar', start: 7, end: 9, depth: 1 },
    ])).toEqual([{
      name: 'main', totalTime: 10, selfTime: 5,
      children: [
        { name: 'foo', totalTime: 3, selfTime: 3, children: [] },
        { name: 'bar', totalTime: 2, selfTime: 2, children: [] },
      ],
    }])
  })

  it('three levels deep', () => {
    expect(buildCallTree([
      { name: 'a', start: 0, end: 10, depth: 0 },
      { name: 'b', start: 0, end: 10, depth: 1 },
      { name: 'c', start: 0, end: 10, depth: 2 },
    ])).toEqual([{
      name: 'a', totalTime: 10, selfTime: 0,
      children: [{
        name: 'b', totalTime: 10, selfTime: 0,
        children: [
          { name: 'c', totalTime: 10, selfTime: 10, children: [] },
        ],
      }],
    }])
  })

  it('full scenario', () => {
    expect(buildCallTree([
      { name: 'main', start: 0, end: 40, depth: 0 },
      { name: 'foo', start: 0, end: 30, depth: 1 },
      { name: 'bar', start: 0, end: 20, depth: 2 },
      { name: 'baz', start: 30, end: 40, depth: 1 },
    ])).toEqual([{
      name: 'main', totalTime: 40, selfTime: 0,
      children: [
        {
          name: 'foo', totalTime: 30, selfTime: 10,
          children: [
            { name: 'bar', totalTime: 20, selfTime: 20, children: [] },
          ],
        },
        { name: 'baz', totalTime: 10, selfTime: 10, children: [] },
      ],
    }])
  })
})

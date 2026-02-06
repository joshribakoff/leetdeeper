import { describe, test, expect } from 'vitest';
import { reverseList, toList, toArray } from './solution.js';

test('example 1: [1,2,3,4,5] -> [5,4,3,2,1]', () => {
  const head = toList([1, 2, 3, 4, 5]);
  const result = reverseList(head);
  expect(toArray(result)).toEqual([5, 4, 3, 2, 1]);
});

test('example 2: [1,2] -> [2,1]', () => {
  const head = toList([1, 2]);
  const result = reverseList(head);
  expect(toArray(result)).toEqual([2, 1]);
});

test('example 3: empty list', () => {
  const result = reverseList(null);
  expect(result).toBeNull();
});

test('single node', () => {
  const head = toList([1]);
  const result = reverseList(head);
  expect(toArray(result)).toEqual([1]);
});

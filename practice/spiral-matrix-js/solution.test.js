import { describe, test, expect } from 'vitest';
import { spiralOrder } from './solution.js';

test('example 1: 3x3 matrix', () => {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  expect(spiralOrder(matrix)).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
});

test('example 2: 3x4 matrix', () => {
  const matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
  ];
  expect(spiralOrder(matrix)).toEqual([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
});

test('single row', () => {
  const matrix = [[1, 2, 3, 4]];
  expect(spiralOrder(matrix)).toEqual([1, 2, 3, 4]);
});

test('single column', () => {
  const matrix = [[1], [2], [3], [4]];
  expect(spiralOrder(matrix)).toEqual([1, 2, 3, 4]);
});

test('single element', () => {
  const matrix = [[1]];
  expect(spiralOrder(matrix)).toEqual([1]);
});

test('2x2 matrix', () => {
  const matrix = [
    [1, 2],
    [3, 4]
  ];
  expect(spiralOrder(matrix)).toEqual([1, 2, 4, 3]);
});

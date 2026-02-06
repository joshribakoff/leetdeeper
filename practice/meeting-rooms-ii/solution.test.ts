import { describe, test, expect } from 'vitest'
import { minMeetingRooms } from './solution'

test('example 1: [[0,30],[5,10],[15,20]] -> 2', () => {
  expect(minMeetingRooms([[0,30],[5,10],[15,20]])).toBe(2)
})

test('example 2: [[7,10],[2,4]] -> 1', () => {
  expect(minMeetingRooms([[7,10],[2,4]])).toBe(1)
})

test('empty intervals', () => {
  expect(minMeetingRooms([])).toBe(0)
})

test('single meeting', () => {
  expect(minMeetingRooms([[1,5]])).toBe(1)
})

test('all overlapping', () => {
  expect(minMeetingRooms([[1,10],[2,9],[3,8]])).toBe(3)
})

import { describe, test, expect } from 'vitest'
import { canAttendMeetings } from './solution'

test('example 1: [[0,30],[5,10],[15,20]] -> false', () => {
  expect(canAttendMeetings([[0,30],[5,10],[15,20]])).toBe(false)
})

test('example 2: [[7,10],[2,4]] -> true', () => {
  expect(canAttendMeetings([[7,10],[2,4]])).toBe(true)
})

test('empty intervals', () => {
  expect(canAttendMeetings([])).toBe(true)
})

test('single meeting', () => {
  expect(canAttendMeetings([[1,5]])).toBe(true)
})

test('back-to-back meetings (no overlap)', () => {
  expect(canAttendMeetings([[1,5],[5,10]])).toBe(true)
})

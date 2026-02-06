import { describe, it, expect } from 'vitest'
import { canFinish } from './solution'

describe('Course Schedule', () => {
  it('example 1: numCourses=2, prerequisites=[[1,0]] -> true', () => {
    expect(canFinish(2, [[1, 0]])).toBe(true)
  })

  it('example 2: numCourses=2, prerequisites=[[1,0],[0,1]] -> false', () => {
    expect(canFinish(2, [[1, 0], [0, 1]])).toBe(false) // cycle
  })

  it('no prerequisites', () => {
    expect(canFinish(3, [])).toBe(true)
  })
})

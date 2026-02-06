import { describe, test, expect } from 'vitest'
import { MedianFinder } from './solution'

describe('Find Median from Data Stream', () => {
  test('example 1', () => {
    const medianFinder = new MedianFinder()
    medianFinder.addNum(1)
    medianFinder.addNum(2)
    expect(medianFinder.findMedian()).toBe(1.5)
    medianFinder.addNum(3)
    expect(medianFinder.findMedian()).toBe(2)
  })

  test('single element', () => {
    const medianFinder = new MedianFinder()
    medianFinder.addNum(5)
    expect(medianFinder.findMedian()).toBe(5)
  })

  test('negative numbers', () => {
    const medianFinder = new MedianFinder()
    medianFinder.addNum(-1)
    medianFinder.addNum(-2)
    expect(medianFinder.findMedian()).toBe(-1.5)
  })

  test('many elements', () => {
    const medianFinder = new MedianFinder()
    medianFinder.addNum(6)
    medianFinder.addNum(10)
    medianFinder.addNum(2)
    medianFinder.addNum(6)
    medianFinder.addNum(5)
    expect(medianFinder.findMedian()).toBe(6)
  })
})

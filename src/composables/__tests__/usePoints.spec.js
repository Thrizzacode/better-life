import { describe, it, expect, beforeEach } from 'vitest'
import { usePoints } from '../usePoints.js'

describe('usePoints composable', () => {
  beforeEach(() => {
    // Reset state before each test
    const { resetAll } = usePoints()
    resetAll()
    localStorage.clear()
  })

  it('should initialize with default values', () => {
    const { hasOnboarded, targetPoints, currentPoints, logs } = usePoints()
    expect(hasOnboarded.value).toBe(false)
    expect(targetPoints.value).toBe(100)
    expect(currentPoints.value).toBe(0)
    expect(logs.value).toEqual([])
  })

  it('should complete onboarding and update target points', () => {
    const { completeOnboarding, hasOnboarded, targetPoints } = usePoints()
    completeOnboarding(200)
    expect(hasOnboarded.value).toBe(true)
    expect(targetPoints.value).toBe(200)
  })

  it('should add points correctly', () => {
    const { addPoints, currentPoints, logs } = usePoints()
    
    // Using predefined category 'minor' which is 1 point
    const entry = addPoints('minor', 'test note')
    
    expect(currentPoints.value).toBe(1)
    expect(logs.value).toHaveLength(1)
    expect(logs.value[0].categoryId).toBe('minor')
    expect(logs.value[0].note).toBe('test note')
    expect(logs.value[0].id).toBe(entry.id)
  })

  it('should delete log and reduce points correctly', () => {
    const { addPoints, deleteLog, currentPoints, logs } = usePoints()
    
    const entry = addPoints('moderate', 'test') // 3 points
    expect(currentPoints.value).toBe(3)
    
    deleteLog(entry.id)
    
    expect(currentPoints.value).toBe(0)
    expect(logs.value).toHaveLength(0)
  })

  it('should calculate progress percent correctly', () => {
    const { addPoints, completeOnboarding, progressPercent } = usePoints()
    
    completeOnboarding(10)
    addPoints('severe') // 5 points
    
    expect(progressPercent.value).toBe(50)
  })
})

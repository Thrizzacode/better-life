import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'
import { usePoints } from '../../composables/usePoints.js'

describe('ProgressBar.vue', () => {
  beforeEach(() => {
    const { resetAll } = usePoints()
    resetAll()
    localStorage.clear()
  })

  it('renders correctly with initial points', () => {
    const wrapper = mount(ProgressBar)
    // Check initial points
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('/ 100') // Default target is 100
    expect(wrapper.text()).toContain('還差')
    expect(wrapper.text()).toContain('100 點')
  })

  it('updates display when points are added', async () => {
    const wrapper = mount(ProgressBar)
    const { addPoints } = usePoints()
    
    // Add 5 points
    addPoints('severe')
    
    await wrapper.vm.$nextTick()
    
    // The points should be updated in UI
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('95 點')
  })

  it('shows target reached message when current points exceed target', async () => {
    const wrapper = mount(ProgressBar)
    const { completeOnboarding, addPoints } = usePoints()
    
    completeOnboarding(5)
    addPoints('severe') // 5 points added
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('已達成 🎉')
    expect(wrapper.text()).toContain('離職吧！')
  })
})

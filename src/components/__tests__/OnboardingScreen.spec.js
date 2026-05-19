import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OnboardingScreen from '../OnboardingScreen.vue'
import { usePoints } from '../../composables/usePoints.js'

describe('OnboardingScreen.vue', () => {
  beforeEach(() => {
    const { resetAll } = usePoints()
    resetAll()
    localStorage.clear()
  })

  it('renders correctly with default values', () => {
    const wrapper = mount(OnboardingScreen)
    const input = wrapper.find('input[type="number"]')
    expect(input.element.value).toBe('100')
    const submitBtn = wrapper.find('#onboarding-submit-btn')
    expect(submitBtn.attributes('disabled')).toBeUndefined()
  })

  it('shows error when input is invalid', async () => {
    const wrapper = mount(OnboardingScreen)
    const input = wrapper.find('input[type="number"]')
    
    // Set to negative number
    await input.setValue(-10)
    
    const submitBtn = wrapper.find('#onboarding-submit-btn')
    expect(submitBtn.attributes('disabled')).toBeDefined()
    
    await input.trigger('keydown.enter')
    expect(wrapper.text()).toContain('請輸入至少 1 點')
  })

  it('updates input when preset is clicked', async () => {
    const wrapper = mount(OnboardingScreen)
    const presetBtn = wrapper.find('#preset-200')
    await presetBtn.trigger('click')
    
    const input = wrapper.find('input[type="number"]')
    expect(input.element.value).toBe('200')
  })

  it('calls completeOnboarding when valid form is submitted', async () => {
    const wrapper = mount(OnboardingScreen)
    const { hasOnboarded, targetPoints } = usePoints()
    
    const input = wrapper.find('input[type="number"]')
    await input.setValue(150)
    
    const submitBtn = wrapper.find('#onboarding-submit-btn')
    await submitBtn.trigger('click')
    
    expect(hasOnboarded.value).toBe(true)
    expect(targetPoints.value).toBe(150)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AddPointsPanel from '../AddPointsPanel.vue'
import { usePoints } from '../../composables/usePoints.js'

describe('AddPointsPanel.vue', () => {
  beforeEach(() => {
    const { resetAll } = usePoints()
    resetAll()
    localStorage.clear()
  })

  it('has submit button disabled initially', () => {
    const wrapper = mount(AddPointsPanel)
    const submitBtn = wrapper.find('#submit-points-btn')
    expect(submitBtn.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('請先選擇類型')
  })

  it('enables submit and shows examples when category is selected', async () => {
    const wrapper = mount(AddPointsPanel)
    
    const minorBtn = wrapper.find('#add-points-minor')
    await minorBtn.trigger('click')
    
    const submitBtn = wrapper.find('#submit-points-btn')
    expect(submitBtn.attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).toContain('常見例子：')
  })

  it('submits correctly and resets form', async () => {
    const wrapper = mount(AddPointsPanel)
    const { logs, currentPoints } = usePoints()
    
    const moderateBtn = wrapper.find('#add-points-moderate') // 3 points
    await moderateBtn.trigger('click')
    
    const textarea = wrapper.find('textarea')
    await textarea.setValue('主管太煩了')
    
    const submitBtn = wrapper.find('#submit-points-btn')
    await submitBtn.trigger('click')
    
    // Check state updates
    expect(currentPoints.value).toBe(3)
    expect(logs.value).toHaveLength(1)
    expect(logs.value[0].note).toBe('主管太煩了')
    
    // Check form is reset
    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.find('#submit-points-btn').attributes('disabled')).toBeDefined()
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsPanel from '../SettingsPanel.vue'
import { usePoints } from '../../composables/usePoints.js'

describe('SettingsPanel.vue', () => {
  beforeEach(() => {
    const { resetAll } = usePoints()
    resetAll()
    localStorage.clear()
  })

  it('updates target points when save is clicked', async () => {
    const wrapper = mount(SettingsPanel)
    const { targetPoints, completeOnboarding } = usePoints()
    completeOnboarding(100)
    
    const input = wrapper.find('#settings-target-input')
    await input.setValue(250)
    
    const saveBtn = wrapper.find('#settings-save-btn')
    await saveBtn.trigger('click')
    
    expect(targetPoints.value).toBe(250)
  })

  it('shows confirmation when reset is clicked', async () => {
    const wrapper = mount(SettingsPanel)
    
    const resetBtn = wrapper.find('#reset-btn')
    await resetBtn.trigger('click')
    
    expect(wrapper.text()).toContain('確定要清除所有資料嗎？')
    expect(wrapper.find('#reset-confirm-btn').exists()).toBe(true)
  })

  it('resets all data when confirmation is approved', async () => {
    const wrapper = mount(SettingsPanel)
    const { addPoints, currentPoints } = usePoints()
    
    addPoints('minor')
    expect(currentPoints.value).toBe(1)
    
    const resetBtn = wrapper.find('#reset-btn')
    await resetBtn.trigger('click')
    
    const confirmBtn = wrapper.find('#reset-confirm-btn')
    await confirmBtn.trigger('click')
    
    expect(currentPoints.value).toBe(0)
  })
})

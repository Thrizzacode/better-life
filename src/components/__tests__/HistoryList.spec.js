import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HistoryList from '../HistoryList.vue'
import { usePoints } from '../../composables/usePoints.js'

describe('HistoryList.vue', () => {
  beforeEach(() => {
    const { resetAll } = usePoints()
    resetAll()
    localStorage.clear()
  })

  it('shows empty state when there are no logs', () => {
    const wrapper = mount(HistoryList)
    expect(wrapper.text()).toContain('目前一筆都沒有')
    expect(wrapper.text()).toContain('共 0 筆')
  })

  it('renders list of logs when data exists', async () => {
    const { addPoints } = usePoints()
    addPoints('minor', 'test minor')
    addPoints('severe', 'test severe')
    
    const wrapper = mount(HistoryList)
    
    expect(wrapper.text()).toContain('共 2 筆')
    expect(wrapper.text()).toContain('test minor')
    expect(wrapper.text()).toContain('test severe')
  })

  it('deletes log when delete button is clicked', async () => {
    const { addPoints, logs } = usePoints()
    const entry = addPoints('minor', 'test minor')
    
    const wrapper = mount(HistoryList)
    
    // Mock window.confirm
    window.confirm = () => true
    
    const deleteBtn = wrapper.find(`#delete-log-${entry.id}`)
    await deleteBtn.trigger('click')
    
    expect(logs.value).toHaveLength(0)
    expect(wrapper.text()).toContain('目前一筆都沒有')
  })
})

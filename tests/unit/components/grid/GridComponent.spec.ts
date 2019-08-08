import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import GridComponent from '@/components/grid/GridComponent.vue'

describe('GridComponent.vue', () => {
  const emptyProps = {
    grid: [],
    gridAssessments: [],
    gridVariables: [],
    gridSelections: [],
    isLoading: false
  }

  describe('when created', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      window.addEventListener = jest.fn()
      wrapper = shallowMount(GridComponent, {
        propsData: { ...emptyProps }
      })
    })

    it('should render the grid', () => {
      expect(wrapper.find('#grid')).toBeTruthy()
      expect(window.addEventListener).toHaveBeenCalled()
    })
  })

  describe('when destroyed', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      window.removeEventListener = jest.fn()
      wrapper = shallowMount(GridComponent, {
        propsData: { ...emptyProps }
      })
    })

    it('should remove the scroll listener', () => {
      wrapper.destroy()
      expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('should change table header on scroll', () => {
      const vm:any = wrapper.vm
      vm.getTableTop = jest.fn().mockReturnValue(10)
      vm.getHeaderHeight = jest.fn().mockReturnValue(20)
      expect(vm.$data.stickyTableHeader).toBeFalsy()
      vm.scroll()
      expect(vm.$data.stickyTableHeader).toBeTruthy()
      vm.getTableTop = jest.fn().mockReturnValue(20)
      vm.getHeaderHeight = jest.fn().mockReturnValue(10)
      vm.scroll()
      expect(vm.$data.stickyTableHeader).toBeFalsy()
    })
  })
})

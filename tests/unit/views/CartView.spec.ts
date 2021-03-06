import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'

import CartSection from '@/types/CartSection'
import CartView from '@/views/CartView.vue'
import Vuex from 'vuex'
import Vue from 'vue'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('CartView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  let stubs = {
    RouterLink: RouterLinkStub,
    'toast-component': true
  }

  let mocks = {
    $router: {
      push: jest.fn()
    }
  }

  let store: any
  let actions: any

  let cartTree: CartSection[]

  const getters = {
    cartTree: () => cartTree,
    isSignedIn: () => true
  }

  beforeEach(() => {
    let state: any
    actions = {
      save: jest.fn()
    }

    state = {
      gridSelection: {
        123: [1, 2],
        456: [3]
      },
      variables: {
        123: {
          id: 123,
          name: 'var123',
          label: 'var 123'
        },
        456: {
          id: 456,
          name: 'var456',
          label: 'var 456'
        }
      },
      assessments: {
        1: {
          id: 1,
          name: 'assessment1'
        },
        2: {
          id: 1,
          name: 'assessment3'
        },
        3: {
          id: 1,
          name: 'assessment3'
        }
      }
    }

    cartTree = [{
      id: 1,
      name: 'Section 1',
      subsections: [{
        name: 'Subsection 1',
        variables: [{
          id: 123,
          name: 'var123',
          label: 'var 123',
          subsections: [1],
          subsection: 1
        }]
      }]
    }, {
      id: 2,
      name: 'Section 2',
      subsections: [{
        name: 'Subsection 2',
        variables: [{
          id: 456,
          name: 'var456',
          label: 'var 456',
          subsections: [2],
          subsection: 2
        }]
      }]
    }]

    store = new Vuex.Store({
      state,
      actions,
      getters
    })
  })

  it('renders cart view', () => {
    // CartView types do not match, but they should
    // @ts-ignore
    const wrapper = mount(CartView, { stubs, store, localVue })
    expect(wrapper.findAll('li').at(0).text()).toEqual('var 123 ( assessment1, assessment3 )')
    expect(wrapper.findAll('li').at(1).text()).toEqual('var 456 ( assessment3 )')
    expect(wrapper.find('#cart-view')).toMatchSnapshot()
  })

  it('renders a save button that saves the current state', async () => {
    actions.save.mockResolvedValue('12345')
    // CartView types do not match, but they should
    // @ts-ignore
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })
    wrapper.find('.save').trigger('click')
    await flushPromises()
    expect(mocks.$router.push).toHaveBeenCalledWith({ name: 'load', params: { orderNumber: '12345' } })
  })

  it('has the first selection open on start', async () => {
    // @ts-ignore
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })
    expect(wrapper.find('#accordion-0').isVisible()).toBeTruthy()
  })

  it('has a collapsable menu', async () => {
    // @ts-ignore
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })
    const cartHeader = wrapper.find('.hoverable')
    cartHeader.trigger('click')
    expect(wrapper.find('#accordion-0').isVisible()).toBeFalsy()
  })

  it('has a collapsable menu', async () => {
    // @ts-ignore
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })

    const cartHeader = wrapper.find('.hoverable')
    cartHeader.trigger('click')

    expect(wrapper.find('#accordion-0').isVisible()).toBeFalsy()
  })

  it('removes closed menu items', async () => {
    // @ts-ignore
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })

    expect(wrapper.vm.openItems).toHaveLength(1)

    const cartHeader = wrapper.find('.hoverable')
    cartHeader.trigger('click')

    expect(wrapper.vm.openItems).toHaveLength(0)
  })

  it('adds open menu items', async () => {
    // @ts-ignore
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })

    const cartHeader = wrapper.find('.hoverable')
    cartHeader.trigger('click')

    // the first element closes on click.
    expect(wrapper.vm.openItems).toHaveLength(0)

    cartHeader.trigger('click')
    // the element is openened
    expect(wrapper.vm.openItems).toHaveLength(1)
  })
})

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import withConnectedHandler from '../index'
import { compose, withProps, withState } from 'recompose'

configure({ adapter: new Adapter() })

describe('withConnectedHandler HOC', () => {
  it('creates connected handler correctly', () => {
    const initialState = { s1: 1, s2: 2 }

    const store = createStore((state = initialState, action) => {
      return state
    })

    const CONNECTED_HANDLER = 'CONNECTED_HANDLER'

    const MOCK_ACTION = 'MOCK_ACTION'
    const mockAction = jest.fn((s1, p1, p2) => ({
      type: MOCK_ACTION,
      payload: {
        s1,
        p1,
        p2,
      },
    }))

    const component = jest.fn(() => null)

    const handlerTracker = jest.fn()
    const handler = props => (...args) => {
      handlerTracker({ props, args })
      props.mockAction(props.s1, props.p1, props.p2)
    }

    const Component = compose(
      withState('localState', 'setLocalState', { p1: 3, p2: 4 }),
      withProps(({ localState }) => ({ ...localState })),
      withConnectedHandler({
        actions: { mockAction },
        name: CONNECTED_HANDLER,
        handler,
        args: { s1: state => state.s1, p1: 'p1', p2: (_, props) => props.p2 },
      }),
    )(component)

    mount(
      <Provider {...{ store }}>
        <Component />
      </Provider>,
    )

    expect(handlerTracker).toHaveBeenCalledTimes(0)

    const {
      [CONNECTED_HANDLER]: connectedHandler,
      setLocalState,
      dispatch,
      mockAction: connectedMockAction,
    } = component.mock.calls[0][0]

    connectedHandler('a', 'b', 'c')
    expect(handlerTracker).toHaveBeenCalledTimes(1)
    expect(handlerTracker).toHaveBeenLastCalledWith({
      args: ['a', 'b', 'c'],
      props: { dispatch, mockAction: connectedMockAction, p1: 3, p2: 4, s1: 1 },
    })
    expect(mockAction).toHaveBeenCalledTimes(1)
    expect(mockAction).toHaveLastReturnedWith({
      payload: { p1: 3, p2: 4, s1: 1 },
      type: 'MOCK_ACTION',
    })

    setLocalState({ p1: 6, p2: 7 })
    expect(handlerTracker).toHaveBeenCalledTimes(1)
    expect(mockAction).toHaveBeenCalledTimes(1)

    connectedHandler('d', 'e', 'f')
    expect(handlerTracker).toHaveBeenCalledTimes(2)
    expect(handlerTracker).toHaveBeenLastCalledWith({
      args: ['d', 'e', 'f'],
      props: { dispatch, mockAction: connectedMockAction, p1: 6, p2: 7, s1: 1 },
    })
  })
})

import React from 'react'
import { useAction, ContextType } from '../../packages/useAction'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { renderHook } from 'react-hooks-testing-library'

afterEach(() => {
  cleanup()
})

describe('Integration Tests of useAction', () => {

  const initialValue = {
    id: 0,
    name: 'foo',
    age: 18
  }
  const age = 19;

  const actions = {
    grow: ({ commit }: ContextType, age: number) => {
      // invoke commit
      commit({
        age
      })
    },
    testInject: ({ commit, contextProps }: ContextType) => {
      commit({
        id: contextProps.id
      })
    },
    testDispath: ({ dispatch }: ContextType) => {
      dispatch('grow', 1)
    }
  }

  const testComponentId = 'tcid'
  const testButtonId = 'tbid'


  it('Can rerender successfully when invoking dispatch function and commit function', async () => {
    const Component = () => {
      const [state, dispatch] = useAction(actions, initialValue)
  
      return (
        <>
          <span data-testid={testComponentId}>{state.age}</span>
          <button
            onClick={ _ => {
              dispatch('grow', age)
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }
  
    const { getByTestId } = render(<Component/>)
    expect(getByTestId(testComponentId)
      .textContent
    ).toBe(String(initialValue.age))

    fireEvent.click(getByTestId(testButtonId))

    expect(getByTestId(testComponentId)
      .textContent
    ).toBe(String(age))

    cleanup()
  })

  it('Can get context props when call third value which is \'inject\' function to inject contxt prop to actions', async () => {
    const Component = (props: {id: number}) => {
      const [state, dispatch, inject] = useAction(actions, initialValue)
      inject(props)
  
      return (
        <>
          <span data-testid={testComponentId}>{state.id}</span>
          <button
            onClick={ _ => {
              dispatch('testInject')
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }
  
    const { getByTestId } = render(<Component id={1}/>)
    fireEvent.click(getByTestId(testButtonId))
    expect(getByTestId(testComponentId).textContent).toBe('1')
    cleanup()
  })

  it('Can dispatch other action when one action calling dispatch function passed by Context', async () => {
    const Component = () => {
      const [state, dispatch] = useAction(actions, initialValue)
  
      return (
        <>
          <span data-testid={testComponentId}>{state.age}</span>
          <button
            onClick={ _ => {
              dispatch('testDispath')
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }
  
    const { getByTestId } = render(<Component/>)
    fireEvent.click(getByTestId(testButtonId))
    expect(getByTestId(testComponentId).textContent).toBe('1')
    cleanup()
  })

  it('When dispatching some no exiting actions, should cause promise reject', () => {
    const { result } = renderHook(() => useAction(actions, initialValue))
    const {current: [_, dispatch]} = result

    expect(dispatch('xxxyy')).rejects.toThrow()
    cleanup()
  })
})

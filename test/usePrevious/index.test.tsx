import React from 'react'
import { usePrevious, useState } from '../../packages'
import { cleanup, render, fireEvent } from '@testing-library/react'
import { renderHook } from 'react-hooks-testing-library'

afterEach(() => {
  cleanup()
})

describe('Integration Tests of usePrevious', () => {

  const initialValue = {
    count: 1,
    age: 18
  }

  it('usePrevious should return undefined when being first invoked', async () => {
    const { result: {current: [state]} } = renderHook(() => useState(initialValue))
    const { result } = renderHook(() => usePrevious(state))
    expect(result.current).toBe(undefined)
  })

  it('After the second time invoked, should return the previous state', () => {
    const testCurrentId = 'tcid'
    const testPrevId = 'tpcid'
    const testButtonId = 'tbid'

    interface TestType {
      age: number;
      count: number;
    }
    const Component = () => {
      const [state, setState] = useState(initialValue)
      const previous: TestType | undefined = usePrevious<TestType | undefined>(state)
      return (
        <>
          previous count: <span data-testid={testPrevId}>{previous ? previous.count : ''}</span>
          current count: <span data-testid={testCurrentId}>{state.count}</span>
          <button
            onClick={ _ => {
              setState({
                count: state.count + 1
              })
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }
    const { getByTestId } = render(<Component />)

    expect(getByTestId(testPrevId)
      .textContent
    ).toBe('')

    fireEvent.click(getByTestId(testButtonId))

  
    expect(getByTestId(testCurrentId)
      .textContent
    ).toBe(String(initialValue.count + 1))

    expect(getByTestId(testPrevId)
      .textContent
    ).toBe(String(initialValue.count))

  })
})

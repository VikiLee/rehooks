import React from 'react'
import { useCookie, getCookie, setCookie } from '../../packages/useCookie'
import { render, fireEvent, cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

describe('Integration Tests of useCookie', () => {

  const initialValue = 'hello word'
  const newValue = 'hello China'

  it('Should get value from cookie when the key exists in cookie', () => {
    const key = 'foo'
    const testComponentId = 'tcid'
    setCookie(key, initialValue)

    const Component = () => {
      const [value] = useCookie(key, initialValue)
      return (
        <>
          <span data-testid={testComponentId}>{value}</span>
        </>
      )
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId(testComponentId)
      .textContent
    ).toBe(getCookie(key))
  })

  it('Component should rerender when invoking SetCookieAction and set new cookie value into cookie', () => {
    const key = 'foo1'
    const testButtonId = 'tbid1'
    const testComponentId = 'tcid1'

    const Component = () => {
      const [value, setValue] = useCookie(key, initialValue)
      return (
        <>
          <span data-testid={testComponentId}>{value}</span>
          <button
            onClick={ _ => {
              setValue(newValue)
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId(testComponentId)
      .textContent
    ).toBe(initialValue)

    fireEvent.click(getByTestId(testButtonId))

    expect(getByTestId(testComponentId)
      .textContent
    ).toBe(newValue)

    expect(getCookie(key)).toBe(newValue)
  })

  it('Component should rerender When invoking RemoveCookieAction and cookie should be remove', () => {
    const key = 'foo2'
    const testButtonId = 'tbid2'
    const testComponentId = 'tcid2'

    const Component = () => {
      const [value, _, remove] = useCookie(key, initialValue)
      return (
        <>
          <span data-testid={testComponentId}>{value}</span>
          <button
            onClick={ _ => {
              remove()
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId(testComponentId)
      .textContent
    ).toBe(initialValue)

    fireEvent.click(getByTestId(testButtonId))

    expect(getByTestId(testComponentId)
      .textContent
    ).toBe('')

    expect(getCookie(key)).toBe('')
  })
})

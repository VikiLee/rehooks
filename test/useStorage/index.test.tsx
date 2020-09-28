import React from 'react'
import { useStorage } from '../../packages/useStorage'
import { render, fireEvent, cleanup } from '@testing-library/react'

beforeEach(() => {
  cleanup()
  jest.resetModules()
  localStorage.clear()
})

describe('Integration Tests of useStorage hook', () => {

  let testComponentId = 'tcid'
  let testButtonId = 'tbid'
  const prevKey = '_sp_'
  const testKey = 'test'

  it('Can set initial value into storage and return value', () => {
    const initValue = '111'
    let Component = () => {
      const [value] = useStorage<string>(testKey, initValue)
      return <span data-testid={testComponentId}>{value}</span>
    }

    let testComponent = render(<Component />)
    expect(localStorage.getItem('_sp_' + testKey)).toBe(initValue);
    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(initValue)
  })

  it('Can set object value into storage and return value', () => {
    const initValue = {name: 'xxx', age: 18}
    let Component = () => {
      const [value] = useStorage<{name: string, age: number}>(testKey, initValue)
      return <span data-testid={testComponentId}>{value.name}-{value.age}</span>
    }

    let testComponent = render(<Component />)
    expect(JSON.parse(localStorage.getItem('_sp_' + testKey) as string)).toEqual(initValue);
    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(initValue.name + '-' + initValue.age)
  })

  it('Should return value in storage when value already exists in storage', () => {
    const existsValue = '333'
    localStorage.setItem(prevKey + testKey, existsValue)
    let Component = () => {
      const [value] = useStorage<string>(testKey, '111')
      return <span data-testid={testComponentId}>{value}</span>
    }

    let testComponent = render(<Component />)
    expect(localStorage.getItem('_sp_' + testKey)).toBe(existsValue);
    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(existsValue)
  })

  it('Update value correctly and page re render', () => {
    const updateValue = '222'
    let Component = () => {
      const [value, setValue] = useStorage<string>('test', '111')
      return (
        <>
          <span data-testid={testComponentId}>{value}</span>
          <button
            onClick={_ => {
              setValue(updateValue)
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }
    let testComponent = render(<Component />)
    fireEvent.click(testComponent.getByTestId(testButtonId))
    expect(localStorage.__STORE__[prevKey + testKey]).toBe(updateValue);
    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(updateValue)
  })

  it('Page would not re render when the fireRender in option is set to false', () => {
    const initValue = '111'
    const updateValue = '222'
    let Component = () => {
      const [value, setValue] = useStorage<string>('test', initValue, { fireRender: false })
      return (
        <>
          <span data-testid={testComponentId}>{value}</span>
          <button
            onClick={_ => {
              setValue(updateValue)
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }
    let testComponent = render(<Component />)
    fireEvent.click(testComponent.getByTestId(testButtonId))
    expect(localStorage.getItem('_sp_' + testKey)).toBe(updateValue);
    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(initValue)
  })

  it('Can remove correctly', () => {
    const initValue = '111'
    let Component = () => {
      const [value, _, remove] = useStorage<string>('test', initValue)
      return (
        <>
          <span data-testid={testComponentId}>{value || ''}</span>
          <button
            onClick={_ => {
              remove()
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }
    let testComponent = render(<Component />)
    fireEvent.click(testComponent.getByTestId(testButtonId))
    expect(localStorage.getItem('_sp_' + testKey)).toBe(null);
    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe('')
  })

})
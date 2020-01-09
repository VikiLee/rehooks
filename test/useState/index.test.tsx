import React, { useState as useReactState} from 'react'
import { useState } from '../../packages/useState'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { renderHook, act } from 'react-hooks-testing-library'

afterEach(() => {
  cleanup()
})

describe('Integration Tests of useState hook', () => {

  it('Can use like react native "useState"', () => {

    // basic value
    const basicValue = 'This is initial text'
    const newBasicValue = 'This is text change by useState'
    let testComponentId = 'tcid'
    let _testComponentId = '_tcid'
    const testButtonId = 'tbid'

    let Component = () => {
      const [str, setStr] = useState(basicValue)
      const [_str, _setStr] = useReactState(basicValue)
      return (
        <>
          <span data-testid={testComponentId}>{str}</span>
          <span data-testid={_testComponentId}>{_str}</span>
          <button
            onClick={_ => {
              setStr(newBasicValue)
              _setStr(newBasicValue)
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }

    let testComponent = render(<Component />)

    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(basicValue)

    expect(testComponent
      .getByTestId(_testComponentId)
      .textContent
    ).toBe(basicValue)

    fireEvent.click(testComponent.getByTestId(testButtonId))

    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(newBasicValue)

    expect(testComponent
      .getByTestId(_testComponentId)
      .textContent
    ).toBe(newBasicValue)

    // array value
    const arrayValue = [1]
    const newArrayValue = [3, 2]
    const arrCompId = 'atid'
    const _arrCompId = '_atid'
    const testArrButtonId = 'tabid'

    let ArrComponent = () => {
      const [arr, setArr] = useState(arrayValue)
      const [_arr, _setArr] = useReactState(arrayValue)
      return (
        <>
          <span data-testid={arrCompId}>{arr.join(',')}</span>
          <span data-testid={_arrCompId}>{_arr.join(',')}</span>
          <button
            onClick={_ => {
              setArr(newArrayValue)
              _setArr(newArrayValue)
            }}
            data-testid={testArrButtonId}
          >Test Button</button>
        </>
      )
    }

    let testArrComponent = render(<ArrComponent />)

    expect(testArrComponent
      .getByTestId(arrCompId)
      .textContent
    ).toBe(arrayValue.join(','))
    expect(testArrComponent
      .getByTestId(_arrCompId)
      .textContent
    ).toBe(arrayValue.join(','))

    fireEvent.click(testArrComponent.getByTestId(testArrButtonId))

    expect(testArrComponent
      .getByTestId(arrCompId)
      .textContent
    ).toBe(newArrayValue.join(','))
    expect(testArrComponent
      .getByTestId(_arrCompId)
      .textContent
    ).toBe(newArrayValue.join(','))
  })

  it('Component should rerender when calling setStateAction', () => {
    interface StateType {
      name: string;
      age: number;
    }
    const initialValue: StateType = {
      name: 'weiji.li', 
      age: 18
    }
    const newValue = {
      name: 'weiji.li',
      age: 2
    }
    const testNameId = 'tnid'
    const testAgeId = 'taid'
    const testButtonId = 'tbid'

    const Component = () => {
      const [state, setState] = useState<StateType>(initialValue)
      return (
        <>
          <span data-testid={testNameId}>{state.name}</span>
          <span data-testid={testAgeId}>{state.age}</span>
          <button
            onClick={_ => {
              setState(newValue)
            }}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }

    const testComponent = render(<Component />)

    expect(testComponent
      .getByTestId(testNameId)
      .textContent
    ).toBe(initialValue.name)

    expect(testComponent
      .getByTestId(testAgeId)
      .textContent
    ).toBe(String(initialValue.age))

    fireEvent.click(testComponent.getByTestId(testButtonId))

    expect(testComponent
      .getByTestId(testNameId)
      .textContent
    ).toBe(newValue.name)
    expect(testComponent
      .getByTestId(testAgeId)
      .textContent
    ).toBe(String(newValue.age))
  })

  it('Can accept nested object and extend form previous state', () => {
    const initialValue = {
      name: 'weiji.li', 
      age: 18,
      school: {
        name: 'Peking University',
        location: 'Beijing'
      }
    }
    const newValue = {
      school: {
        name: 'Qinghua University',
        location: 'Beijing'
      }
    }
    const testSchollNameId = 'tnid'
    const testNameId= 'taid'
    const testButtonId = 'tbid'

    const Component = () => {
      const [state, setState] = useState(initialValue)
      return (
        <>
          <span data-testid={testNameId}>{state.name}</span>
          <span data-testid={testSchollNameId}>{state.school.name}</span>
          <button
            onClick={_ => {setState(newValue)}}
            data-testid={testButtonId}
          >Test Button</button>
        </>
      )
    }

    const testComponent = render(<Component />)

    expect(testComponent
      .getByTestId(testSchollNameId)
      .textContent
    ).toBe(initialValue.school.name)


    fireEvent.click(testComponent.getByTestId(testButtonId))

    expect(testComponent
      .getByTestId(testNameId)
      .textContent
    ).toBe(initialValue.name)

    expect(testComponent
      .getByTestId(testSchollNameId)
      .textContent
    ).toBe(newValue.school.name)
  })
})

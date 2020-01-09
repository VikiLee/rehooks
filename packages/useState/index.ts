import { useState as useReactState } from 'react'
import { extend, isPlainObject } from 'lodash'

/**
 * Enhance react native to keep previous state when current state is changed
 *
 * @export
 * @param {T} initialState The initial state passed from Component
 * @return {[T, (nextState: Partial<T> | T) => void]} An array containing curent state and SetStateAction function
 */
export function useState <T = any>(initialState: T): [T, (nextState: Partial<T> | T) => void] {
    const [state, setReactState] = useReactState<T>(initialState)

    const setState = (nextState: Partial<T> | T): void => {
      // if state is not plain object, use native SetStateAction
      if (!isPlainObject(initialState)) {
        return setReactState(nextState as T)
      }
      setReactState((prevState: T) => {
        let newState: any = nextState
        newState = extend({}, prevState, nextState)
        return newState
      })
    }
    return [state, setState]
}

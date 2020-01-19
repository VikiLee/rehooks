import { useCallback, useRef} from 'react'
import { useState } from '../useState'

/**
 * dispatch => actions: actions commit mutations and can contain arbitrary asynchronous operations.
 * commit => mutations: change state
 * @param actions set of actions
 * @param initialState initial state
 * @returns {[State: any, Dispatch]} An array containing curent state and dispatch function
 */
export const useAction = <T = any> (actions: {[actionName: string]: Function}, initialState: any): [T, DispatchAction, InjectAction] => {
  const [state, setState] = useState<T>(initialState)
  const currentState = useRef(state)
  const context = useRef({
    props: null
  })

  const commit = useCallback((newState: T) => {
    setState(newState)
    currentState.current = newState
  }, [])

  const dispatch = useCallback(async (actionName: string, ...params: any[]): Promise<any> => {
    if (!actions[actionName]) {
      return Promise.reject(new Error(`Action '${actionName}' does not exits!!!`))
    }
    // first parameter is context which contains state、commit、dispatch and contextProps property
    return await actions[actionName]({ state: currentState.current, commit, dispatch, contextProps: context.current.props }, ...params) 
  }, [])

  // currently it is used for inject props from context useAction being called
  const inject = useCallback((contextProps: any): void => {
    context.current.props = contextProps
  }, [])

  return [state, dispatch, inject]
}

export type DispatchAction  = (actionName: string, ...params: any[]) => void
export type InjectAction = (contextProps: any) => void

export interface ContextType {
  state: any;
  contextProps: any;
  commit: (state: any) => void;
  dispatch: DispatchAction
}
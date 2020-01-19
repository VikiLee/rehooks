/**
 * dispatch => actions: actions commit mutations and can contain arbitrary asynchronous operations.
 * commit => mutations: change state
 * @param actions set of actions
 * @param initialState initial state
 * @returns {[State: any, Dispatch]} An array containing curent state and dispatch function
 */
export declare const useAction: <T = any>(actions: {
    [actionName: string]: Function;
}, initialState: any) => [T, DispatchAction, InjectAction];
export declare type DispatchAction = (actionName: string, ...params: any[]) => void;
export declare type InjectAction = (contextProps: any) => void;
export interface ContextType {
    state: any;
    contextProps: any;
    commit: (state: any) => void;
    dispatch: DispatchAction;
}
//# sourceMappingURL=index.d.ts.map
/**
 * Enhance react native to keep previous state when current state is changed
 *
 * @export
 * @param {T} initialState The initial state passed from Component
 * @return {[T, (nextState: Partial<T> | T) => void]} An array containing curent state and SetStateAction function
 */
export declare function useState<T = any>(initialState: T): [T, (nextState: Partial<T> | T) => void];
//# sourceMappingURL=index.d.ts.map
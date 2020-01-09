"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const lodash_1 = require("lodash");
/**
 * Enhance react native to keep previous state when current state is changed
 *
 * @export
 * @param {T} initialState The initial state passed from Component
 * @return {[T, (nextState: Partial<T> | T) => void]} An array containing curent state and SetStateAction function
 */
function useState(initialState) {
    const [state, setReactState] = react_1.useState(initialState);
    const setState = (nextState) => {
        // if state is not plain object, use native SetStateAction
        if (!lodash_1.isPlainObject(initialState)) {
            return setReactState(nextState);
        }
        setReactState((prevState) => {
            let newState = nextState;
            newState = lodash_1.extend({}, prevState, nextState);
            return newState;
        });
    };
    return [state, setState];
}
exports.useState = useState;
//# sourceMappingURL=index.js.map
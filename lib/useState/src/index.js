"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const lodash_1 = require("lodash");
/**
 * Enhance react native to keep previous state when current state is changed
 *
 * @export
 * @param {T} initialState The initial state passed from Component
 * @return {[T, Dispatch<T>]} An array containing curent state and setState function
 */
function useState(initialState) {
    const [state, setReactState] = react_1.useState(initialState);
    const setState = react_1.useCallback((nextState) => {
        setReactState((prevState) => {
            let newState = nextState;
            if (lodash_1.isObject(initialState)) {
                newState = lodash_1.extend({}, prevState, nextState);
            }
            else {
                newState = nextState;
            }
            return newState;
        });
    }, []);
    return [state, setState];
}
exports.useState = useState;
;
//# sourceMappingURL=index.js.map
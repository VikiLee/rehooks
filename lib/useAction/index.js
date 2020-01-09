"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useState_1 = require("../useState");
/**
 * dispatch => actions: actions commit mutations and can contain arbitrary asynchronous operations.
 * commit => mutations: change state
 * @param actions set of actions
 * @param initialState initial state
 * @returns {[State: any, Dispatch]} An array containing curent state and dispatch function
 */
exports.useAction = (actions, initialState) => {
    const [state, setState] = useState_1.useState(initialState);
    const currentState = react_1.useRef(state);
    const context = react_1.useRef({
        props: null
    });
    const commit = react_1.useCallback((newState) => {
        setState(newState);
        currentState.current = newState;
    }, []);
    const dispatch = react_1.useCallback((actionName, ...params) => __awaiter(this, void 0, void 0, function* () {
        if (!actions[actionName]) {
            return Promise.reject(new Error(`Action '${actionName}' does not exits!!!`));
        }
        // first parameter is context which contains state、commit、dispatch and contextProps property
        return yield actions[actionName]({ state: currentState.current, commit, dispatch, contextProps: context.current.props }, ...params);
    }), []);
    // currently it is used for inject props from context useAction being called
    const inject = react_1.useCallback((contextProps) => {
        context.current.props = contextProps;
    }, []);
    return [state, dispatch, inject];
};
//# sourceMappingURL=index.js.map
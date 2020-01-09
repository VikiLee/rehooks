"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// usePrevious state
function usePrevious(value) {
    // 利用useRef提供的容器保存上个state到容器的current
    const prev = react_1.useRef();
    let result = prev.current || undefined;
    prev.current = value;
    return result;
}
exports.usePrevious = usePrevious;
//# sourceMappingURL=index.js.map
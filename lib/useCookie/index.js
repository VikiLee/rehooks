"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function getCookie(name) {
    return (document.cookie.match(new RegExp('(^' + name + '| ' + name + ')=([^;]*)')) == null) ? '' : decodeURIComponent(RegExp.$2);
}
exports.getCookie = getCookie;
function setCookie(name, value, options) {
    options = options || {};
    let str = name + '=' + encodeURIComponent(value)
        + `; path=${options.path ? options.path : '/'};`
        + `; domain=${options.domain ? options.domain : ''}`;
    if (options.expires) {
        const exp = new Date(options.expires);
        str += ' expires=' + exp.toGMTString();
    }
    document.cookie = str;
}
exports.setCookie = setCookie;
function removeCookie(name) {
    setCookie(name, '', {
        expires: -1
    });
}
exports.removeCookie = removeCookie;
function useCookie(key, initValue = '', options) {
    options = options || {};
    // 如果cookie不存在值 将初始化值更新到cookie中
    if (!getCookie(key)) {
        setCookie(key, initValue, options);
    }
    const [value, setValue] = react_1.useState(getCookie(key));
    const remove = react_1.useMemo(() => () => {
        setValue('');
    }, []);
    const set = react_1.useMemo(() => (value, options) => {
        options = options || {};
        setCookie(key, initValue, options);
        setValue(value);
    }, []);
    // Keep state and cookie in sync 
    react_1.useEffect(() => {
        setCookie(key, value);
        if (value === '') {
            removeCookie(key);
        }
    }, [value]);
    return [value, set, remove];
}
exports.useCookie = useCookie;
//# sourceMappingURL=index.js.map
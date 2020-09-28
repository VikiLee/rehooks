"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prevKey = '_sp_';
function tryParse(value) {
    if (value === null) {
        return null;
    }
    try {
        return JSON.parse(value);
    }
    catch (_a) {
        return value;
    }
}
function getItem(key) {
    return tryParse(localStorage.getItem(prevKey + key));
}
function setItem(key, val) {
    localStorage.setItem(prevKey + key, typeof val === 'object'
        ? JSON.stringify(val)
        : `${val}`);
}
/**
 * 用户获取/设置localStorage，并且在storage中的值改变的时候更新ui
 * 注意： 如果不想在storage修改时改变ui，请设置option的fireRender为false
 */
function useStorage(key, initialValue, option = {}) {
    const [isInitialized, setInitialized] = react_1.useState(false); // 删除storage后，需要标记为true，防止rerender又初始化写进storage
    // localStorage中没有值，初始值放入localstorage中
    if (!isInitialized && initialValue !== undefined && !localStorage.getItem(prevKey + key)) {
        setItem(key, initialValue);
        setInitialized(true);
    }
    const [val, setStorage] = react_1.useState(getItem(key));
    const set = react_1.useCallback((value) => {
        try {
            setItem(key, value);
            if (option.fireRender === undefined || option.fireRender) {
                setStorage(value);
            }
        }
        catch (err) {
            if (err instanceof TypeError && err.message.includes('circular structure')) {
                throw new TypeError('The object that was given to the writeStorage function has circular references.\n' +
                    'For more information, check here: ' +
                    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value');
            }
            throw err;
        }
    }, [setStorage]);
    const remove = () => {
        localStorage.removeItem(prevKey + key);
        if (option.fireRender === undefined || option.fireRender) {
            setStorage(null);
        }
    };
    react_1.useEffect(() => {
        const handleChange = (e) => {
            option.onChange && option.onChange(tryParse(e.newValue));
        };
        window.addEventListener('storage', handleChange);
        return () => window.removeEventListener('storage', handleChange);
    }, []);
    return [val, set, remove];
}
exports.useStorage = useStorage;
//# sourceMappingURL=index.js.map
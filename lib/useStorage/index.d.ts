interface Option<T> {
    fireRender?: boolean;
    onChange?: (value: T) => void;
}
/**
 * 用户获取/设置localStorage，并且在storage中的值改变的时候更新ui
 * 注意： 如果不想在storage修改时改变ui，请设置option的fireRender为false
 */
export declare function useStorage<T = string>(key: string, initialValue: T, option?: Option<T>): any[];
export {};
//# sourceMappingURL=index.d.ts.map
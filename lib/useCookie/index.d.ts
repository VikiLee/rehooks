export interface CookieOption {
    expires?: number;
    domain?: string;
    path?: string;
}
export declare type SetCookieAction = (value: string | boolean | number, options?: CookieOption) => void;
export declare type RemoveCookieAction = () => void;
export declare function getCookie(name: string): string;
export declare function setCookie(name: string, value: string | boolean | number, options?: CookieOption): void;
export declare function removeCookie(name: string): void;
export declare function useCookie(key: string, initValue?: string | boolean | number, options?: CookieOption): [string, SetCookieAction, RemoveCookieAction];
//# sourceMappingURL=index.d.ts.map
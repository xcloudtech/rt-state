import { Provider } from './model';
export type Target = object;
export interface ProviderSetupContext {
    _isInSetup: boolean;
    _providers?: Provider<any, any>[];
    unWatchers: any[];
    value: any;
}
type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
export type DefaultProps<T> = Pick<T, OptionalKeys<T>>;
export type DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9> = [T1] | [T1, T2] | [T1, T2, T3] | [T1, T2, T3, T4] | [T1, T2, T3, T4, T5] | [T1, T2, T3, T4, T5, T6] | [T1, T2, T3, T4, T5, T6, T7] | [T1, T2, T3, T4, T5, T6, T7, T8] | [T1, T2, T3, T4, T5, T6, T7, T8, T9];
export declare const notEqual: (a: any, b: any) => any;
export declare const isObj: (x: any) => boolean;
export declare const isFn: (x: any) => boolean;
export declare function deepClone(item: any): any;
export {};

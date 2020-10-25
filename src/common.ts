import { Provider } from './model';

export type Target = object;

export interface HooksRef<T> {
    current: T;
}

export interface ProviderSetupContext {
    _isInSetup: boolean;
    _providers?: Provider<any, any>[];
    unWatchers: any[];
    value: any;
}

type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type DefaultProps<T> = Pick<T, OptionalKeys<T>>;

export type DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9> =
    | [T1]
    | [T1, T2]
    | [T1, T2, T3]
    | [T1, T2, T3, T4]
    | [T1, T2, T3, T4, T5]
    | [T1, T2, T3, T4, T5, T6]
    | [T1, T2, T3, T4, T5, T6, T7]
    | [T1, T2, T3, T4, T5, T6, T7, T8]
    | [T1, T2, T3, T4, T5, T6, T7, T8, T9];

export const notEqual = (a, b) => {
    if (!a) {
        return true;
    }
    return a.some((arg, index) => arg !== b[index]);
};

export const isObj = (x: any): boolean => typeof x === 'object';
export const isFn = (x: any): boolean => typeof x === 'function';

const includeNonEnumerable = false;

export function deepClone(item) {
    if (item === null || typeof item !== 'object') {
        return item;
    }
    if (item instanceof Date) {
        return new Date(item.valueOf());
    }
    if (item instanceof Array) {
        const copy = [];
        item.forEach((_, i) => (copy[i] = deepClone(item[i])));
        return copy;
    }
    if (item instanceof Set) {
        const copy = new Set();
        item.forEach((v) => copy.add(deepClone(v)));
        return copy;
    }
    if (item instanceof Map) {
        const copy = new Map();
        item.forEach((v, k) => copy.set(k, deepClone(v)));
        return copy;
    }
    if (item instanceof Object) {
        const copy = {};
        // * Object.symbol
        Object.getOwnPropertySymbols(item).forEach((s) => (copy[s] = deepClone(item[s])));
        // * Object.name (other)
        if (includeNonEnumerable) {
            Object.getOwnPropertyNames(item).forEach((k) => (copy[k] = deepClone(item[k])));
        } else {
            Object.keys(item).forEach((k) => (copy[k] = deepClone(item[k])));
        }
        return copy;
    }
    throw new Error(`Unable to copy object: ${item}`);
}

export type Target = object;

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

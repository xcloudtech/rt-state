import * as React from 'react';
import { Context, Provider, StateLink, HooksRef, Watcher, WatchOptions } from './model';
import { DefaultProps, DepsReturnType } from './common';
export declare function setDebugComponentName(name: string): void;
interface CreateConfig<T> {
    providers?: Provider<any, any>[];
    defaultProps?: DefaultProps<T>;
}
type RFC<T> = React.FC<T & {
    style?: React.CSSProperties;
    className?: string;
}>;
export declare function create<T extends object>(setup: (ctx: Context<T>) => RFC<T>, config?: CreateConfig<T>): RFC<T>;
export declare function createS<T extends object>(Comp: RFC<T>, config?: CreateConfig<T>): RFC<T>;
export declare function hooks<T>(cb: () => T): HooksRef<T>;
export declare function link<T>(getter: () => T, setter?: (v: T) => void, options?: WatchOptions): StateLink<T>;
export declare function watch<T1, T2, T3, T4, T5, T6, T7, T8, T9>(cb: (values: DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>, oldValues: DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>) => void | Promise<void>, deps: () => DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>, options?: WatchOptions): Watcher;
export {};

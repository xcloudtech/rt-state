import { DefaultProps } from './common';
import { ContextProps } from './context';

export interface StateV<T> {
    value: T;
}

export interface Context<T> {
    readonly debugName: string;
    active: boolean;
    readonly props: T;
    defaultProps: DefaultProps<T>;
    w(): T;
    onDispose(cb: () => void): void;
    forceUpdate(): void;
    peek<S>(contextProps: ContextProps<S>): S;
}

export interface WatchOptions {
    compare?: boolean;
    global?: boolean;
}

export interface Watcher {
    readonly active: boolean;
    readonly debugName: string;
    unwatch(): void;
}

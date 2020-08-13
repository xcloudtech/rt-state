import * as React from 'react';

export interface StateV<T> {
    value: T;
}

export interface Context<T> {
    readonly debugName: string;
    active: boolean;
    readonly props: T;
    w(): T;
    onDispose(cb: () => void): void;
    forceUpdate(): void;
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

export interface Provider<T, I> {
    init(value: I): Provider<T, I>;
    use(): T; // use it only in functional component.
    Context: React.Context<T>; // use it only in class component.
}

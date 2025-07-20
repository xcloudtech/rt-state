import * as React from 'react';
export type State<T> = T;
export interface StateOptions {
    clone?: boolean;
    separate?: boolean;
}
export interface StateS<T> {
    value: T;
    extract(): T;
    forceUpdate(): void;
}
export interface HooksRef<T> {
    current: T;
}
export interface StateLink<T> {
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
    use(): T;
    Context: React.Context<T>;
}

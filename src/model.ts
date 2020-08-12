export interface StateV<T> {
    value: T;
}

export interface PropsWrapper<T> {
    props: T;
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

export interface Provider<P, I> {
    init(value: I): Provider<P, I>;
    use(): P;
}

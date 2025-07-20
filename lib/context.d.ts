import { Provider, StateS, HooksRef } from './model';
import { Executor } from './core';
import { DefaultProps, ProviderSetupContext } from './common';
export declare class _Context<T> {
    private cleanup;
    _providers: Provider<any, any>[];
    _hooksCb: () => any;
    hooksRef: HooksRef<any>;
    executor: Executor;
    _compDebugName: string;
    _props: T;
    _watchProps: StateS<T>;
    _defaultProps: DefaultProps<T>;
    _updateView: () => void;
    _isInSetup: boolean;
    constructor(props: T, update: () => void);
    addDisposeCallBack(cb: () => void): void;
    dispose(): void;
    updateProps(props: T): void;
    use(): any;
    get debugName(): string;
    get active(): boolean;
    get props(): T;
    w(): T;
    onDispose(cb: () => void): void;
    forceUpdate(): void;
}
export declare const ctxContainer: {
    currCtx: _Context<any>;
    currProviderSetupCtx: ProviderSetupContext;
};

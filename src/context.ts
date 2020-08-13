import { Provider, StateV } from './model';
import { Executor, stateV } from './core';
import { DefaultProps } from './common';

// Context can be used in any functions within the setup function.
export class _Context<T> {
    private cleanup: Set<() => void>;
    _providers: Provider<any, any>[];
    _use: () => any;
    _dataFromHooks: any;
    executor: Executor;
    _compDebugName: string;
    _props: T;
    _watchProps: StateV<T>;
    _defaultProps: DefaultProps<T>;
    _updateView: () => void;
    _isInSetup: boolean;

    constructor(props: T, update: () => void) {
        this.cleanup = new Set<() => void>();
        this._props = props;
        this._watchProps = stateV<T>(props);
        this._updateView = update;
        this._isInSetup = false;
    }
    /////////////////////////
    addDisposeCallBack(cb: () => void) {
        if (!this.cleanup.has(cb)) {
            this.cleanup.add(cb);
        }
    }
    dispose() {
        this.cleanup.forEach((c) => c());
    }
    updateProps(props: T) {
        if (props !== this._props) {
            this._props = props;
            this._watchProps.value = props;
        }
    }
    use() {
        if (this._isInSetup) {
            return null;
        }
        ctxContainer.currCtx._providers?.forEach((p) => {
            p.use();
        });
        return this._use?.();
    }
    /////////////////////////
    // Just for debugging.
    get debugName(): string {
        return this._compDebugName;
    }
    // if the component is unmounted, its active is false.
    get active(): boolean {
        return this.executor.active ?? false;
    }
    // latest Prop values with defaultProps.
    get props(): T {
        if (this._defaultProps != null) {
            return Object.freeze({ ...this._defaultProps, ...this._props });
        }
        return this._props;
    }
    // can be used to watch any changes of any prop in `watch` function.
    // like: ctx.w().prop1
    w(): T {
        return this._watchProps.value;
    }
    // will be called when the component is about to be unmounted.
    onDispose(cb: () => void) {
        this.addDisposeCallBack(cb);
        if (!this._isInSetup) {
            throw new Error('"onDispose" can only be called within the setup function of the current component.');
        }
    }

    forceUpdate() {
        // Avoid rendering twice for the first time.
        if (this.executor) {
            this._updateView();
        }
    }
}

export const ctxContainer: {
    currCtx: _Context<any>;
} = { currCtx: null };

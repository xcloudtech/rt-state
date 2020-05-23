import * as React from 'react';
import { track, trigger, stateV, Executor } from './core';
import { Context, ContextProps, StateV, Watcher, WatchOptions } from './model';
import { DefaultProps, DepsReturnType, notEqual } from './common';
import { _provide } from './context';

let currCtx: _Context<any>;

// for debug only.
export function setDebugComponentName(name: string) {
    currCtx._compDebugName = `${name}_${Executor.GlobalId++}`;
}
// setup:
//  -- only be called once at the beginning of the whole lifecycle of the component.
//  -- Create some states, or use watch/link functions or create any user defined functions or any normal (non-reactive) variables.
//  -- return a render function, which can be used for rendering the components many times.
interface CreateConfig<T> {
    provider?: ContextProps<any>[];
    defaultProps?: DefaultProps<T>;
}
export function create<T extends object>(
    setup: (ctx: Context<T>) => (props: T) => React.ReactNode,
    config?: CreateConfig<T>,
) {
    const Comp = (props: T) => {
        const update = React.useReducer((s) => s + 1, 0)[1];
        const ctxRef = React.useRef<_Context<T>>(new _Context(props, update));
        const ctx = ctxRef.current;
        currCtx = ctx;
        React.useEffect(() => {
            return () => {
                ctx.dispose();
                ctxRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        ////////////////////////////////////////////////
        ctx.updateProps(props);

        let { executor } = ctx;
        if (!executor) {
            ctx._isInSetup = true;
            const render = setup(ctx);
            ctx._isInSetup = false;
            executor = new Executor(() => render(ctx.props), update);
            ctx.addDisposeCallBack(() => executor.unwatch());
            ctx.executor = executor;
        }
        const needUpdate = ctx.use();
        if (!needUpdate && ctx._oldDom) {
            return ctx._oldDom;
        }
        ctx._oldDom = executor.getter();
        return ctx._oldDom;
    };
    return _provide(config?.provider, Comp);
}

export function createS<T extends object>(
    render: (props: T) => React.ReactNode,
    config?: CreateConfig<T>,
) {
    return create<T>((ctx) => {
        if (config?.defaultProps) {
            ctx.defaultProps = config?.defaultProps;
        }
        return render;
    }, config);
}

export function useHooks(cb: () => boolean | void) {
    if (!currCtx._isInSetup) {
        throw new Error(
            '"useHooks" can only be used within the setup function of the component.',
        );
    }
    if (currCtx._use != null) {
        throw new Error(
            '"useHooks" can only be used once within the component.',
        );
    }
    currCtx._use = cb;
    const ret = cb();
    currCtx._useReturnFunc = () => ret;
}

export function _checkAndPush<P>(ctxProps: ContextProps<P>) {
    if (!currCtx._isInSetup) {
        throw new Error(
            '"ContextProps.use()" can only be used within the setup function of the component.',
        );
    }
    if (currCtx._use != null) {
        throw new Error(
            '"ContextProps.use()" can only be used before "useHooks".',
        );
    }
    currCtx._ctxPropsList = currCtx._ctxPropsList ?? [];
    currCtx._ctxPropsList.push(ctxProps);
}

export function link<T>(
    getter: () => T,
    setter?: (v: T) => void,
    options?: WatchOptions,
): StateV<T> {
    const linkId = {};
    let value: T;

    const update = (newValues: T) => {
        value = newValues[0];
        trigger(linkId, '.');
    };

    const watcher = watchWithOption(update, () => [getter()], options);

    return {
        watcher, // just for debug.
        get value() {
            track(linkId, '.');
            return value;
        },
        set value(newValue: T) {
            if (watcher.active && setter != null) {
                setter(newValue);
            }
        },
    } as StateV<T>;
}

export function watch<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    cb: (
        values: DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>,
        oldValues: DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>,
    ) => void | Promise<void>,
    deps: () => DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>,
    options?: WatchOptions,
) {
    return watchWithOption(cb, deps, options);
}

function watchWithOption(
    cb: (values, oldValues) => void | Promise<void>,
    deps: () => any[],
    options?: WatchOptions,
): Watcher {
    const compare = options?.compare ?? true;
    const isGlobal = options?.global;
    ////////////////////////////////////////
    let oldValues = null;
    const update = () => {
        if (!executor.active) {
            return;
        }
        const values = executor.getter();
        let needCall = true;
        if (compare) {
            needCall = notEqual(values, oldValues);
        }
        if (needCall) {
            cb(values, oldValues);
        }
        oldValues = values;
    };
    const getter = deps ?? (() => null);

    const executor = new Executor(getter, update);

    // If it is not a global watcher.
    if (!isGlobal) {
        if (!currCtx || !currCtx._isInSetup) {
            throw new Error(
                '"watch" can only be called within the setup function of the current component, or use it out of the component and set it to be global.',
            );
        }
        currCtx.addDisposeCallBack(() => executor.unwatch());
    }

    const values = executor.getter();
    cb(values, oldValues);
    oldValues = values;

    return executor;
}

// Context can be used in any functions within the setup function.
// tslint:disable-next-line:class-name
class _Context<T> {
    private cleanup: Set<() => void>;
    _ctxPropsList: ContextProps<any>[];
    _use: () => boolean | void;
    _useReturnFunc: () => boolean | void;
    _oldDom: any;
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
        if (this._useReturnFunc) {
            const ret = this._useReturnFunc();
            this._useReturnFunc = null;
            return ret;
        }
        currCtx._ctxPropsList?.forEach((ctxProps) => {
            const { _useValue } = ctxProps as any;
            _useValue();
        });
        return this._use?.() ?? true;
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
            return { ...this._defaultProps, ...this._props };
        }
        return this._props;
    }
    set defaultProps(value: DefaultProps<T>) {
        this._defaultProps = value;
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
            throw new Error(
                '"onDispose" can only be called within the setup function of the current component.',
            );
        }
    }

    forceUpdate() {
        // Avoid rendering twice for the first time.
        if (this.executor) {
            this._updateView();
        }
    }
}

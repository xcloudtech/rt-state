import * as React from 'react';
import { track, trigger, stateV, Executor } from './core';
import { Context, StateV, Watcher } from './model';
import { DefaultProps, DepsReturnType, notEqual } from './common';
import { memo } from 'react';

let currCtx: _Context<any>;

// for debug only.
export function setDebugComponentName(name: string) {
    currCtx._compDebugName = `${name}_${Executor.GlobalId++}`;
}
// setup:
//  -- only be called once at the beginning of the whole lifecycle of the component.
//  -- Create same states, or use watch/link functions or create any user defined functions or any normal (non-reactive) variables.
//  -- return a render function, which can be used for rendering the components many times.
export function create<T extends object>(setup: (ctx: Context<T>) => (props: T) => React.ReactNode): React.FC<T> {
    //////////////////////////////////////////////////
    const dom = React.memo((props: T) => {
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
        const needUpdate = ctx.use();
        if (!needUpdate && ctx._oldDom) {
            return ctx._oldDom;
        }

        let { executor } = ctx;
        if (!executor) {
            const render = setup(ctx);
            executor = new Executor(() => render(ctx.props), update);
            ctx.addDisposeCallBack(() => executor.unwatch());
            ctx.executor = executor;
        }
        ctx._oldDom = executor.getter();
        return ctx._oldDom;
    });
    return dom as any;
}
// useHooks: only used when need the functionality of another library which is using React Hooks APIs.
// -- IMPORTANT: use 'useHooks' as less as possible.
// -- The callback function will be called again and again before rendering the component.
// -- If the return value is false, the view will not be rendered.
export function useHooks(cb: () => boolean | void) {
    if (currCtx._use != null) {
        throw new Error('Can not call use function twice within one component');
    }
    currCtx._use = cb;
    return currCtx.use();
}
// only rerender when any props has changed. (non-reactive)
export { memo as cache };

// -- deep: update the link value, and update its parent(most of the time, the view) as long as any state* changes in the deps function.
export function deepLink<T>(getter: () => T, setter?: (v: T) => void): StateV<T> {
    return linkWithOptions(getter, setter, 'deep');
}
// -- update the link value, and update its parent when the value changes.
export function link<T>(getter: () => T, setter?: (v: T) => void): StateV<T> {
    return linkWithOptions(getter, setter, null);
}

// linkWithOptions is a pair of getter and setter function.
function linkWithOptions<T>(getter: () => T, setter: (v: T) => void, option: 'deep' | null): StateV<T> {
    const linkId = {};
    let value: T;

    const update = (newValues: T) => {
        value = newValues[0];
        trigger(linkId, '.');
    };

    const watcher = watchWithOption(update, () => [getter()], option);

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

// watch the deps function.
// -- call cb function once when any 'state*' values in the deps function gets updated and the deps value list is not the same as before.
export function watch<T1, T2, T3, T4, T5, T6, T7, T8, T9>(cb: (values: DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>, oldValues: DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>) => void | Promise<void>, deps?: () => DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>) {
    return watchWithOption(cb, deps, null);
}
// watch the deps function.
// -- call cb function once when any 'state*' values in the deps function gets updated.
export function deepWatch<T1, T2, T3, T4, T5, T6, T7, T8, T9>(cb: (values: DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>, oldValues: DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>) => void | Promise<void>, deps?: () => DepsReturnType<T1, T2, T3, T4, T5, T6, T7, T8, T9>) {
    return watchWithOption(cb, deps, 'deep');
}

export function watchWithOption(cb: (values, oldValues) => void | Promise<void>, deps: () => any[], option: 'deep' | null): Watcher {
    let oldValues = null;
    const update = () => {
        if (!executor.active) {
            return;
        }
        const values = executor.getter();
        let needCall = true;
        if (option == null) {
            needCall = notEqual(values, oldValues);
        }
        if (needCall) {
            cb(values, oldValues);
        }
        oldValues = values;
    };
    const getter = deps ?? (() => null);

    const executor = new Executor(getter, update);
    currCtx?.addDisposeCallBack(() => executor.unwatch());

    const values = executor.getter();
    cb(values, oldValues);
    oldValues = values;

    return executor;
}

// Context can be used in any functions within the setup function.
// tslint:disable-next-line:class-name
class _Context<T> {
    private cleanup: Set<() => void>;
    _use: () => boolean | void;
    _oldDom: any;
    executor: Executor;
    _compDebugName: string;
    _props: T;
    _watchProps: StateV<T>;
    _defaultProps: DefaultProps<T>;
    _updateView: () => void;

    constructor(props: T, update: () => void) {
        this.cleanup = new Set<() => void>();
        this._props = props;
        this._watchProps = stateV<T>(props);
        this._updateView = update;
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
    }

    forceUpdate() {
        // Avoid rendering twice for the first time.
        if (this.executor) {
            this._updateView();
        }
    }
}

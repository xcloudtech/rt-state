import * as React from 'react';
import { track, trigger, Executor } from './core';
import { Context, Provider, StateV, Watcher, WatchOptions } from './model';
import { DefaultProps, DepsReturnType, HooksRef, notEqual } from './common';
import { _Context, ctxContainer } from './context';
import { _provide } from './provider';

// for debug only.
export function setDebugComponentName(name: string) {
    ctxContainer.currCtx._compDebugName = `${name}_${Executor.GlobalId++}`;
}
// setup:
//  -- only be called once at the beginning of the whole lifecycle of the component.
//  -- Create some states, or use watch/link functions or create any user defined functions or any normal (non-reactive) variables.
//  -- return a render function, which can be used for rendering the components many times.
interface CreateConfig<T> {
    providers?: Provider<any, any>[];
    defaultProps?: DefaultProps<T>;
}
type RFC<T> = React.FC<T & { style?: React.CSSProperties; className?: string }>;

export function create<T extends object>(setup: (ctx: Context<T>) => RFC<T>, config?: CreateConfig<T>): RFC<T> {
    const Comp = (props: T) => {
        const update = React.useReducer((s) => s + 1, 0)[1];
        const ctxRef = React.useRef<_Context<T>>(new _Context(props, update));
        const ctx = ctxRef.current;
        ctxContainer.currCtx = ctx;
        React.useEffect(() => {
            return () => {
                ctx.dispose();
                ctxRef.current = null;
            };
        }, []);
        ////////////////////////////////////////////////
        ctx.updateProps(props);

        let { executor } = ctx;
        if (!executor) {
            ctx._isInSetup = true;
            if (config?.defaultProps) {
                ctx._defaultProps = Object.freeze(config?.defaultProps);
            }
            const render = setup(ctx);
            executor = new Executor(() => render(ctx.props), update, 'comp');
            ctx.addDisposeCallBack(() => executor.unwatch());
            ctx.executor = executor;
        }
        if (!ctx._isInSetup) {
            const hooksData = ctx.use();
            const hooksRef = ctxContainer.currCtx.hooksRef;
            if (hooksRef !== undefined) {
                // Has called hooks function, so need to update the data ref.
                hooksRef.current = hooksData;
            }
        }

        if (ctx._isInSetup) {
            ctx._isInSetup = false;
        }
        const dom = executor.getter();
        ctxContainer.currCtx = null;
        return dom;
    };
    return _provide(config?.providers, Comp);
}

export function createS<T extends object>(Comp: RFC<T>, config?: CreateConfig<T>) {
    return create<T>((ctx) => Comp, config);
}

export function hooks<T>(cb: () => T): HooksRef<T> {
    const currCtx = ctxContainer.currCtx;
    if (!currCtx._isInSetup) {
        throw new Error('"hooks" can only be used within the setup function of the component.');
    }
    if (currCtx._use != null) {
        throw new Error('"hooks" can only be used once within the component.');
    }
    currCtx._use = cb;

    const current = cb();
    currCtx.hooksRef = { current };
    return currCtx.hooksRef;
}

export function _checkAndPush<P>(provider: Provider<P, any>) {
    const currCtx = ctxContainer.currCtx;
    if (currCtx?._isInSetup) {
        if (currCtx._use != null) {
            throw new Error('"Provider.use()" can only be used before "hooks" if it\'s in setup function.');
        }
        currCtx._providers = currCtx._providers ?? [];
        currCtx._providers.push(provider);
        return;
    }
}

export function link<T>(getter: () => T, setter?: (v: T) => void, options?: WatchOptions): StateV<T> {
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

    const executor = new Executor(getter, update, 'watcher');

    if (ctxContainer.unWatchersInProviderSetup != null) {
        ctxContainer.unWatchersInProviderSetup.push(() => executor.unwatch());
    } else if (!isGlobal) {
        // If it is not a global watcher nor in provider setup.
        const currCtx = ctxContainer.currCtx;
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

import { StateV } from './model';
import { getProxy } from './proxy';
import { useMemo } from 'react';

type Key = string | number;
type Target = object;

type ExecutorSet = Set<Executor>;
type KeyExecutorSet = Map<Key, ExecutorSet>;

const targetMap = new WeakMap<Target, KeyExecutorSet>();

let currExecutor: Executor = null;

export function useRTStateV<T>(initValue?: T): StateV<T> {
    return useMemo(() => stateV(initValue), []);
}

// just to wrap any data within the value field of a state.
// can be used for any data, especially for number and string, or an array.
// WARNING: just watch one level: the value field of the state.
export function stateV<T>(initValue?: T): StateV<T> {
    return state({ value: initValue });
}

export function useRTState<T extends Target>(initValue: T): T {
    return useMemo(() => state(initValue), []);
}

// the state for an object.
// WARNING: just watch one level: just all fields of the object, not for the fields of any fields.
export function state<T extends Target>(initValue: T): T {
    if (targetMap.has(initValue)) {
        throw new Error('can not call state function twice for the same obj.');
    }
    targetMap.set(initValue, new Map() as KeyExecutorSet);
    return getProxy(initValue, handlers);
}

const handlers = {
    get(target: Target, key: Key) {
        const result = Reflect.get(target, key);
        track(target, key);
        return result;
    },
    set(target: Target, key: Key, value: any) {
        const oldValue = Reflect.get(target, key);
        if (value === oldValue) {
            return true;
        }
        const result = Reflect.set(target, key, value);
        trigger(target, key);
        return result;
    },
};

export function track(target: Target, key: Key) {
    const executor = currExecutor;
    if (executor) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let deps = depsMap.get(key);
        if (!deps) {
            depsMap.set(key, (deps = new Set()));
        }
        if (!deps.has(executor)) {
            deps.add(executor);
            executor.deps.add(deps);
        }
    }
}

export function trigger(target: Target, key: Key) {
    const deps = targetMap.get(target);
    const dep = deps?.get(key);
    if (dep) {
        if (depSetForBatchUpdate != null) {
            // in batchChange
            dep.forEach((e) => depSetForBatchUpdate.add(e));
        } else {
            Array.from(dep).forEach((e) => e.update());
        }
    }
}

let depSetForBatchUpdate: Set<Executor> = null;

export function batchUpdate(cb: () => void) {
    if (currExecutor) {
        throw new Error('It can only be used within the Callback function of an event, like click event.');
    }
    if (depSetForBatchUpdate != null) {
        throw new Error('recursively call "batchUpdate", wrong!');
    }
    depSetForBatchUpdate = new Set<Executor>();
    cb();
    const deps = depSetForBatchUpdate;
    depSetForBatchUpdate = null;
    deps.forEach((e) => e.update());
}

export class Executor {
    // Just for debugging.
    static DebugNamePrefix = 'watcher_';
    static GlobalId = 0;
    readonly debugName: string;
    //////////////////////////////

    active: boolean;
    private readonly _getter: () => any;
    private readonly _update: () => void;
    deps?: Set<ExecutorSet>;

    constructor(getter: () => any, update: () => void) {
        this.debugName = `${Executor.DebugNamePrefix}${Executor.GlobalId++}`;

        this.active = true;
        this._getter = getter;
        this._update = update;
    }

    update() {
        return this._update();
    }

    getter() {
        if (!this.active) {
            return this._getter();
        }
        this.cleanup();
        const parent = currExecutor;
        // eslint-disable-next-line consistent-this
        currExecutor = this;
        const ret = this._getter();
        currExecutor = parent;
        return ret;
    }

    private cleanup(): void {
        if (this.deps) {
            this.deps.forEach((deps: ExecutorSet) => deps.delete(this));
        }
        this.deps = new Set<ExecutorSet>();
    }

    unwatch(): void {
        if (this.active) {
            this.cleanup();
            this.active = false;
        }
    }
}

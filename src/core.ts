import { State, StateS } from './model';
import { getProxy } from './proxy';
import { Target } from './common';

type Key = string | number;
type ExecutorSet = Set<Executor>;
type KeyExecutorSet = Map<Key, ExecutorSet>;

const targetMap = new WeakMap<Target, KeyExecutorSet>();
const proxyToTargetMap = new WeakMap<any, Target>();
let currExecutor: Executor = null;
let depSetForBatchUpdate: Set<Executor> = null;

export class _StateS<T> {
    private _value: T;
    private _state: State<{ value: number }>;

    constructor(initValue?: T) {
        this._value = initValue;
        this._state = state({ value: 0 });
    }

    get value() {
        // Don't delete! connect view to data.
        const count = this._state.value;
        return this._value;
    }

    set value(val) {
        const oldValue = this._value;
        this._value = val;
        if (oldValue !== val) {
            this.forceUpdate();
        }
    }

    forceUpdate() {
        this._state.value++;
    }
}
// just to wrap any data within the value field of a state.
// can be used for any data, especially for number and string, or an array.
// WARNING: just watch one level: the value field of the state.
export function stateS<T>(initValue?: T): StateS<T> {
    return new _StateS(initValue);
}
// the state for an object.
// WARNING: just watch one level: just all fields of the object, not for the fields of any fields.
export function state<T extends Target>(initValue: T): State<T> {
    if (initValue == null || typeof initValue === 'number' || typeof initValue === 'string') {
        throw new Error(`initValue cannot be null, number or string.`);
    }
    if (targetMap.has(initValue)) {
        throw new Error('can not call state function twice for the same obj.');
    }
    targetMap.set(initValue, new Map() as KeyExecutorSet);
    const proxy = getProxy(initValue, handlers);
    proxyToTargetMap.set(proxy, initValue);
    return proxy;
}

export function extract<T>(state: State<T>): T {
    let target;
    if (state == null || (target = proxyToTargetMap.get(state)) == null) {
        throw new Error('invalid state.');
    }
    return target;
}

const handlers = {
    get(target: Target, key: Key) {
        const result = Reflect.get(target, key);
        track(target, key);
        return result;
    },
    set(target: Target, key: Key, value: any) {
        if (!Reflect.has(target, key)) {
            throw new Error(`Cannot add property ${key}, object is not extensible`);
        }
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
    static GlobalId = 0;
    readonly debugName: string;
    //////////////////////////////

    active: boolean;
    private readonly _getter: () => any;
    private readonly _update: () => void;
    deps?: Set<ExecutorSet>;

    constructor(getter: () => any, update: () => void, type: string) {
        this.debugName = `${type}_${Executor.GlobalId++}`;

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

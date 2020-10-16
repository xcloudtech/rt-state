import { State, StateS } from './model';
import { getProxy } from './proxy';
import { Target } from './common';

type Key = string | number;
type ExecutorSet = Set<Executor>;
type KeyExecutorSet = Map<Key, ExecutorSet>;

const targetMap = new WeakMap<Target, KeyExecutorSet>();
const targetToDepKeyMap = new WeakMap<Target, string>(); // used when no trigger is true.
const proxyToTargetMap = new WeakMap<any, Target>();
let currExecutor: Executor = null;

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

export function forceUpdate<T extends object>(state: State<T>) {
    const target = extract(state);
    const depKey = targetToDepKeyMap.get(target);
    if (depKey == null) {
        console.warn('state is triggered automatically. No need to call forceUpdate.');
        return;
    }
    trigger(target, depKey); // trigger it manually.
}

const INTERNAL_KEY_FOR_STATE = '`.*&+%@~';
function getDepKey<T extends Target>(initValue: T) {
    let key = INTERNAL_KEY_FOR_STATE;
    while (true) {
        if (!Reflect.has(initValue, key)) {
            return key;
        }
        key += INTERNAL_KEY_FOR_STATE;
    }
}
// the state for an object.
// WARNING: just watch one level: just all fields of the object, not for the fields of any fields.
// If `noUpdate` is true, call `forceUpdate` explicitly to trigger an update.
export function state<T extends Target>(initValue: T, noUpdate?: boolean): State<T> {
    if (initValue == null || typeof initValue === 'number' || typeof initValue === 'string') {
        throw new Error(`initValue cannot be null, number or string.`);
    }
    if (targetMap.has(initValue)) {
        throw new Error('can not call state function twice for the same obj.');
    }
    targetMap.set(initValue, new Map() as KeyExecutorSet);
    const proxy = getProxy(initValue, handlers);
    proxyToTargetMap.set(proxy, initValue);
    if (noUpdate) {
        targetToDepKeyMap.set(initValue, getDepKey(initValue));
    }
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
        const depKey = targetToDepKeyMap.get(target);
        if (depKey == null) {
            trigger(target, key); // trigger it automatically.
        }
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
        const depKey = targetToDepKeyMap.get(target);
        if (depKey != null) {
            key = depKey;
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
const depsCtx = {
    timer: null,
    triggerTime: null,
    deps: new Set<Executor>(),
};

const DELAY_IN_MS = 10;
function asyncUpdate() {
    const now = new Date().getTime();
    if (now < depsCtx.triggerTime) {
        depsCtx.timer = setTimeout(asyncUpdate, DELAY_IN_MS);
        return;
    }
    const deps = depsCtx.deps;
    depsCtx.deps = new Set<Executor>();
    depsCtx.timer = null;
    deps.forEach((e) => e.update());
}

export function trigger(target: Target, key: Key) {
    const deps = targetMap.get(target);
    const dep = deps?.get(key);
    if (dep) {
        dep.forEach((e) => depsCtx.deps.add(e));
        depsCtx.triggerTime = new Date().getTime() + DELAY_IN_MS;

        if (depsCtx.timer == null) {
            depsCtx.timer = setTimeout(asyncUpdate, DELAY_IN_MS);
        }
    }
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
        if (!this.active) {
            return;
        }
        this._update();
    }

    getter() {
        if (!this.active) {
            return null;
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

import { State, StateS, StateOptions } from './model';
import { getProxy } from './proxy';
import { deepClone, isObj, Target } from './common';
import { batchUpdate } from './batch_update';

type Key = string | number;
type ExecutorSet = Set<Executor>;
type KeyExecutorSet = Map<Key, ExecutorSet>;

const targetMap = new WeakMap<Target, ExecutorSet | KeyExecutorSet>();
const proxyToTargetMap = new WeakMap<any, Target>();
let currExecutor: Executor = null;

class _StateS<T> {
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

    extract() {
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

export function setState<T extends object>(state: State<T>, value: T, cloneFields?: boolean) {
    if (!isObj(value) || Array.isArray(value)) {
        throw new Error(`value should be an object.`);
    }
    value = value ?? ({} as T);
    const target = extract(state);
    Object.keys(target).forEach((key) => {
        const fieldValue = Reflect.get(value, key);
        state[key] = cloneFields ? deepClone(fieldValue) : fieldValue;
    });
    //
    Object.keys(value).forEach((key) => {
        if (!Reflect.has(target, key)) {
            console.error(`Cannot add property ${key}, object is not extensible`);
        }
    });
}

// the state for an object.
// WARNING: just watch one level: just all fields of the object, not for the fields of any fields.
// clone: when you need to change the initValue later.
// separate: fine granularity dependency tracking based on each field, not the whole state.
export function state<T extends Target>(initValue: T, options?: StateOptions): State<T> {
    if (initValue == null || !isObj(initValue) || Array.isArray(initValue)) {
        throw new Error(`initValue should be an object and should not be null.`);
    }
    if (options?.clone) {
        initValue = deepClone(initValue);
    }
    const separate = options?.separate;
    const proxy = getProxy(initValue, separate ? handlersForFields : handlers); // can't run this line after the following line in IE 11.
    targetMap.set(initValue, separate ? new Map<Key, ExecutorSet>() : new Set<Executor>());
    proxyToTargetMap.set(proxy, initValue);
    return proxy;
}

// extract the data without creating a dependency.
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
        track(target);
        return result;
    },
    set(target: Target, key: Key, value: any) {
        const success = setTargetFieldValue(target, key, value);
        if (success) {
            trigger(target);
        }
        return true;
    },
};

const handlersForFields = {
    get(target: Target, key: Key) {
        const result = Reflect.get(target, key);
        trackFields(target, key);
        return result;
    },
    set(target: Target, key: Key, value: any) {
        const success = setTargetFieldValue(target, key, value);
        if (success) {
            triggerFields(target, key);
        }
        return true;
    },
};

function setTargetFieldValue(target: Target, key: Key, value: any) {
    if (!Reflect.has(target, key)) {
        console.error(`Cannot add property ${key}, object is not extensible`);
        return false;
    }
    const oldValue = Reflect.get(target, key);
    if (value === oldValue) {
        return false;
    }
    return Reflect.set(target, key, value);
}

export function _addTargetToMap(target: Target) {
    targetMap.set(target, new Set<Executor>());
}

export function track(target: Target) {
    const executor = currExecutor;
    if (executor) {
        const deps = targetMap.get(target) as ExecutorSet;
        linkDependencies(deps, executor);
    }
}

export function trackFields(target: Target, key: Key) {
    const executor = currExecutor;
    if (executor) {
        const depsMap = targetMap.get(target) as KeyExecutorSet;
        let deps: ExecutorSet = depsMap.get(key);
        if (!deps) {
            deps = new Set<Executor>();
            depsMap.set(key, deps);
        }
        linkDependencies(deps, executor);
    }
}

function linkDependencies(deps: ExecutorSet, executor: Executor) {
    if (!deps.has(executor)) {
        deps.add(executor);
        executor.deps.add(deps);
    }
}

const depsCtx = {
    willUpdate: false,
    deps: new Set<Executor>(),
};

let DISABLE_DELAY = false;

export function unstable_disableDelay(cb: () => void) {
    const old = DISABLE_DELAY;
    DISABLE_DELAY = true;
    cb();
    realUpdates();
    DISABLE_DELAY = old;
}

function realUpdates() {
    depsCtx.willUpdate = false;
    const deps = depsCtx.deps;
    if (deps.size > 0) {
        depsCtx.deps = new Set<Executor>();
        batchUpdate(function () {
            deps.forEach((e) => e.update());
        });
    }
}

export function trigger(target: Target) {
    const deps = targetMap.get(target);
    asyncUpdates(deps as ExecutorSet);
}

function triggerFields(target: Target, key: Key) {
    const depsMap = targetMap.get(target) as KeyExecutorSet;
    const deps = depsMap.get(key);
    if (deps) {
        asyncUpdates(deps);
    }
}

function asyncUpdates(deps: ExecutorSet) {
    if (deps.size > 0) {
        deps.forEach((e) => {
            e._dirty = true;
            depsCtx.deps.add(e);
        });
        if (DISABLE_DELAY || depsCtx.willUpdate) {
            return;
        }
        depsCtx.willUpdate = true;
        setTimeout(realUpdates, 10); // Promise.resolve().then(realUpdates);
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
    _dirty: boolean;

    constructor(getter: () => any, update: () => void, type: string) {
        this.debugName = `${type}_${Executor.GlobalId++}`;

        this.active = true;
        this._getter = getter;
        this._update = update;
        this._dirty = false;
    }

    update() {
        if (!this.active) {
            return;
        }
        if (this._dirty) {
            this._update();
        }
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
        return ret ?? null;
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

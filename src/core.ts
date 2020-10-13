import { StateV } from './model';
import { getProxy } from './proxy';
import { Target } from './common';

type Key = string | number;
type ExecutorSet = Set<Executor>;
type KeyExecutorSet = Map<Key, ExecutorSet>;

const targetMap = new WeakMap<Target, KeyExecutorSet>();
let currExecutor: Executor = null;
let depSetForBatchUpdate: Set<Executor> = null;

// just to wrap any data within the value field of a state.
// can be used for any data, especially for number and string, or an array.
// WARNING: just watch one level: the value field of the state.
export function stateV<T>(initValue?: T): StateV<T> {
    return state({ value: initValue });
}

function checkStateSParam<T>(value?: T) {
    if (value == null) {
        return;
    }
    if (typeof value === 'number' || typeof value === 'string') {
        throw new Error(`value cannot be number or string, please use stateV.`);
    }
}

export function stateS<T>(initValue?: T): T {
    checkStateSParam(initValue);
    const stateValue = stateV(initValue);
    return getProxy(stateValue, valueHandlers);
}

let isInSetStateS = false;
export function setStateS<T>(stateS: T, newValue: T) {
    checkStateSParam(newValue);
    if (isInSetStateS) {
        throw new Error('isInSetStateS should be false');
    }
    isInSetStateS = true;
    stateS['any'] = newValue;
}

const DUMMY_OBJ_FOR_REFRESH: any = { type: 'dummy' };

export function forceUpdate<T>(stateS: T) {
    setStateS(stateS, DUMMY_OBJ_FOR_REFRESH);
}

const OWN_KEYS_ERR_MSG = `Do not use any key iterator for this object, including spread operator, JSON.stringify, or render it directly, because it's a state, which is a data Proxy.`;

const valueHandlers = {
    get(target: StateV<any>, key: Key) {
        if (isInSetStateS) {
            throw new Error('unreached code');
        }
        const realTarget = target.value;
        if (realTarget == null) {
            return undefined;
        }
        return realTarget[key];
    },
    set(target: StateV<any>, key: Key, value: any) {
        if (isInSetStateS) {
            isInSetStateS = false;
            if (value === DUMMY_OBJ_FOR_REFRESH) {
                value = { ...target.value };
            }
            target.value = value;
            return true;
        }
        const realTarget = target.value;
        realTarget[key] = value;
        return true;
    },
};

// the state for an object.
// WARNING: just watch one level: just all fields of the object, not for the fields of any fields.
export function state<T extends Target>(initValue: T): T {
    if (initValue != null && (typeof initValue === 'number' || typeof initValue === 'string')) {
        throw new Error(`initValue cannot be number or string, please use stateV.`);
    }
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

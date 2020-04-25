import { StateV } from './model';
import { getProxy } from './proxy';
import { isFn, isObj } from './common';

type Key = string | number;
type Target = object;
type Proxy = object;

type ExecutorSet = Set<Executor>;
type KeyExecutorSet = Map<Key, ExecutorSet>;

const targetMap = new WeakMap<Target, KeyExecutorSet>();
const targetToProxy = new WeakMap<Target, Proxy>();
const proxyToTarget = new WeakMap<Proxy, Target>();

let currExecutor = null;

// @ts-ignore
// eslint-disable-next-line no-new-func
const g = typeof window === 'object' ? window : Function('return this')();
function buildIn({ constructor }: Target) {
    return isFn(constructor) && constructor.name in g && g[constructor.name] === constructor;
}

// just to wrap any data within the value field of a state.
// can be used for any data, especially for number and string, or an array.
// WARNING: just watch one level: the value field of the state.
export function stateV<T>(value?: T): StateV<T> {
    return state({ value });
}
// the state for an object.
// WARNING: just watch one level: just all fields of the object, not for the fields of any fields.
export function state<T extends Target>(obj: T): T {
    if (proxyToTarget.has(obj) || !buildIn(obj)) {
        return obj;
    }
    let proxy = targetToProxy.get(obj);
    if (proxy) {
        return proxy as T;
    }
    proxy = getProxy(obj, handlers);

    targetToProxy.set(obj, proxy);
    proxyToTarget.set(proxy, obj);
    targetMap.set(obj, new Map() as KeyExecutorSet);

    return proxy as T;
}

const handlers = {
    get(target: Target, key: Key) {
        const result = Reflect.get(target, key);
        const proxy = targetToProxy.get(result);
        track(target, key);
        return proxy ?? result;
    },
    set(target: Target, key: Key, value: any) {
        if (isObj(value)) {
            value = proxyToTarget.get(value) ?? value;
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
    dep && Array.from(dep).forEach((e) => e.update());
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

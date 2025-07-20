import { State, StateS, StateOptions } from './model';
import { Target } from './common';
type Key = string | number;
type ExecutorSet = Set<Executor>;
export declare function stateS<T>(initValue?: T): StateS<T>;
export declare function setState<T extends object>(state: State<T>, value: T, cloneFields?: boolean): void;
export declare function state<T extends Target>(initValue: T, options?: StateOptions): State<T>;
export declare function extract<T>(state: State<T>): T;
export declare function _addTargetToMap(target: Target): void;
export declare function track(target: Target): void;
export declare function trackFields(target: Target, key: Key): void;
export declare function unstable_disableDelay(cb: () => void): void;
export declare function trigger(target: Target): void;
export declare class Executor {
    static GlobalId: number;
    readonly debugName: string;
    active: boolean;
    private readonly _getter;
    private readonly _update;
    deps?: Set<ExecutorSet>;
    _dirty: boolean;
    constructor(getter: () => any, update: () => void, type: string);
    update(): void;
    getter(): any;
    private cleanup;
    unwatch(): void;
}
export {};

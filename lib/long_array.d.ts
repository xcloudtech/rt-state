import { StateS } from './model';
export declare function stateArray<T>(initValues: T[]): StateArray<T>;
export interface StateArray<T> {
    values: T[];
    forceUpdate(): void;
    extract(): T[];
    readonly length: number;
    get(idx: number): T;
    set(idx: number, value: T): any;
    push(value: T): any;
    pop(): T;
    add(idx: number, ...values: T[]): any;
    remove(idx: number, deleteCount?: number): any;
    splice(start: number, deleteCount: number, ...values: T[]): any;
    readonly items: StateArrayItem<T>[];
    extractItems(): StateArrayItem<T>[];
    getItem(idx: number): StateArrayItem<T>;
    setItem(idx: number, item: StateArrayItem<T>): any;
    filterItems(filter: (item: StateArrayItem<T>, index: number) => boolean): StateArray<T>;
    mapItems<P>(map: (item: StateArrayItem<T>, index: number) => P): P[];
    spliceItems(start: number, deleteCount: number, ...items: StateArrayItem<T>[]): any;
}
export interface StateArrayItem<T> extends StateS<T> {
    readonly key: number;
}

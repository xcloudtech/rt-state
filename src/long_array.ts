import { stateS } from './core';
import { StateS } from './model';

export function stateArray<T>(initValues: T[]): StateArray<T> {
    return new _StateArray(initValues);
}
// user can just use stateV([]) for ordinary array state.
// this class is an optimized implementation of an array state.
export interface StateArray<T> {
    values: T[];
    forceUpdate(): void;
    extract(): T[];
    readonly length: number;
    get(idx: number): T;
    set(idx: number, value: T);
    push(value: T);
    pop(): T;
    add(idx: number, ...values: T[]);
    remove(idx: number, deleteCount?: number);
    splice(start: number, deleteCount: number, ...values: T[]);

    readonly items: StateArrayItem<T>[];
    extractItems(): StateArrayItem<T>[];
    getItem(idx: number): StateArrayItem<T>;
    setItem(idx: number, item: StateArrayItem<T>);
    filterItems(filter: (item: StateArrayItem<T>, index: number) => boolean): StateArray<T>;
    mapItems<P>(map: (item: StateArrayItem<T>, index: number) => P): P[];
    spliceItems(start: number, deleteCount: number, ...items: StateArrayItem<T>[]);
}

class _StateArray<T> {
    private _state: StateS<StateArrayItem<T>[]>;
    constructor(initValues: T[]) {
        this._state = stateS<_StateArrayItem<T>[]>();
        this.values = initValues;
    }
    get values(): T[] {
        return this._state.value.map((item) => item.value);
    }
    set values(values: T[]) {
        const items = [];
        values?.forEach((v) => {
            items.push(new _StateArrayItem(v));
        });
        this._state.value = items;
    }
    forceUpdate() {
        this._state.forceUpdate();
    }
    extract(): T[] {
        const items = this.extractItems();
        return items?.map((d) => d?.extract());
    }
    get length() {
        return this._state.value.length;
    }
    get(idx: number): T {
        return this.getItem(idx)?.value;
    }
    set(idx: number, value: T) {
        const item = this.getItem(idx);
        if (item == null) {
            return;
        }
        item.value = value;
    }
    push(value: T) {
        this._state.value.push(new _StateArrayItem(value));
        this.refresh();
    }
    pop(): T {
        const item = this._state.value.pop();
        this.refresh();
        return item?.value;
    }
    add(idx: number, ...values: T[]) {
        this.splice(idx, 0, ...values);
    }
    remove(idx: number, deleteCount?: number) {
        this.splice(idx, deleteCount ?? 1);
    }
    splice(start: number, deleteCount: number, ...values: T[]) {
        const items = values?.map((v) => new _StateArrayItem(v)) ?? [];
        this._state.value.splice(start, deleteCount, ...items);
        this.refresh();
    }

    get items(): StateArrayItem<T>[] {
        return this._state.value;
    }
    extractItems(): StateArrayItem<T>[] {
        return this._state.extract();
    }
    getItem(idx: number): StateArrayItem<T> {
        return this._state.value[idx];
    }
    setItem(idx: number, item: StateArrayItem<T>) {
        this.set(idx, item.value);
    }
    filterItems(filter: (item: StateArrayItem<T>, index: number) => boolean): StateArray<T> {
        const value = this._state.value;
        const newValue = value.filter(filter);
        if (newValue.length !== value.length) {
            const newArr = new _StateArray([]);
            newArr._state.value = newValue;
            return newArr;
        }
        return this;
    }
    mapItems<P>(map: (item: StateArrayItem<T>, index: number) => P): P[] {
        return this._state.value.map(map);
    }
    spliceItems(start: number, deleteCount: number, ...items: StateArrayItem<T>[]) {
        this._state.value.splice(start, deleteCount, ...items);
        this.refresh();
    }

    private refresh() {
        this._state.value = [...this._state.value];
    }
}

export interface StateArrayItem<T> extends StateS<T> {
    readonly key: number;
}

class _StateArrayItem<T> {
    static LongArrayItemKeySeq = 1;
    private _state: StateS<T>;
    private readonly _key: number;

    constructor(initValue?: T) {
        this._key = _StateArrayItem.LongArrayItemKeySeq++;
        this._state = stateS(initValue);
    }
    get value(): T {
        return this._state.value;
    }
    set value(value: T) {
        this._state.value = value;
    }
    forceUpdate() {
        this._state.forceUpdate();
    }
    extract() {
        return this._state.extract();
    }
    get key() {
        return this._key;
    }
}

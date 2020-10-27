import { StateS } from './model';
import { useMemo } from 'react';
import { state, stateS } from './core';
import { Target } from './common';
import { stateArray, StateArray } from './long_array';

export function useRStateS<T>(initValue?: T): StateS<T> {
    return useMemo(() => stateS(initValue), []);
}

export function useRState<T extends Target>(initValue: T, clone?: boolean, separate?: boolean): T {
    return useMemo(() => state(initValue, clone, separate), []);
}

export function useRStateArray<T>(initValues?: T[]): StateArray<T> {
    return useMemo(() => stateArray(initValues), []);
}

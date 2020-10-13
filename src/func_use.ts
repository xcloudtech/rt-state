import { StateS, StateV } from './model';
import { useMemo } from 'react';
import { state, stateS, stateV } from './core';
import { Target } from './common';
import { stateArray, StateArray } from './long_array';

export function useRStateV<T>(initValue?: T): StateV<T> {
    return useMemo(() => stateV(initValue), []);
}

export function useRStateS<T extends Target>(initValue?: T): StateS<T> {
    return useMemo(() => stateS(initValue), []);
}

export function useRState<T extends Target>(initValue: T): T {
    return useMemo(() => state(initValue), []);
}

export function useRStateArray<T>(initValues?: T[]): StateArray<T> {
    return useMemo(() => stateArray(initValues), []);
}

import { StateV } from './model';
import { useMemo } from 'react';
import { state, stateS, stateV } from './core';
import { Target } from './common';

export function useRStateV<T>(initValue?: T): StateV<T> {
    return useMemo(() => stateV(initValue), []);
}

export function useRStateS<T extends Target>(initValue?: T): T {
    return useMemo(() => stateS(initValue), []);
}

export function useRState<T extends Target>(initValue: T): T {
    return useMemo(() => state(initValue), []);
}

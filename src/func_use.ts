import { StateS } from './model';
import { useMemo } from 'react';
import { state, stateS } from './core';
import { Target } from './common';
import { stateArray, StateArray } from './long_array';
import { ctxContainer } from './context';

export function useRStateS<T>(initValue?: T): StateS<T> {
    return useMemo(() => {
        if (ctxContainer.currCtx == null) {
            throw new Error('useRStateS could only be used in create/createS');
        }
        return stateS(initValue);
    }, []);
}

export function useRState<T extends Target>(initValue: T, clone?: boolean, separate?: boolean): T {
    return useMemo(() => {
        if (ctxContainer.currCtx == null) {
            throw new Error('useRState could only be used in create/createS');
        }
        return state(initValue, clone, separate);
    }, []);
}

export function useRStateArray<T>(initValues?: T[]): StateArray<T> {
    return useMemo(() => {
        if (ctxContainer.currCtx == null) {
            throw new Error('useRStateArray could only be used in create/createS');
        }
        return stateArray(initValues);
    }, []);
}

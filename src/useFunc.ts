import { StateV } from './model';
import { useMemo, useRef } from 'react';
import { state, stateS, stateV } from './core';
import { Target } from './common';
import { ctxContainer } from './context';

export function useSetup<D extends object, T>(data: D, setup: (data: D) => T): T {
    const setupRef = useRef({ data: {} as any, hasSetup: false, ret: undefined });
    if (data != null) {
        Object.keys(data).forEach((k) => {
            setupRef.current.data[k] = data[k];
        });
    }
    const useSetupCtx = ctxContainer.useSetupCtx;
    if (!setupRef.current.hasSetup) {
        setupRef.current.hasSetup = true;
        useSetupCtx.isIn = true;
        setupRef.current.ret = setup(setupRef.current.data);
        useSetupCtx.isIn = false;
    } else {
        const providers = useSetupCtx.providers;
        providers?.forEach((p) => {
            p.use();
        });
    }
    return setupRef.current.ret;
}

export function useRStateV<T>(initValue?: T): StateV<T> {
    return useMemo(() => stateV(initValue), []);
}

export function useRStateS<T extends Target>(initValue?: T): T {
    return useMemo(() => stateS(initValue), []);
}

export function useRState<T extends Target>(initValue: T): T {
    return useMemo(() => state(initValue), []);
}

import React, { useMemo } from 'react';
import { _checkAndPush } from './func';

const EMPTY: unique symbol = Symbol();

export interface ContextPropsProviderProps<P> {
    children: React.ReactNode;
}

export interface ContextProps<P> {
    use(): P;
}

export function createContextProps<P>(init?: () => P): ContextProps<P> {
    const Context = React.createContext<P | typeof EMPTY>(EMPTY);

    function Provider(props: ContextPropsProviderProps<P>) {
        const value = useMemo(() => init?.(), []);
        return (
            <Context.Provider value={value}>{props.children}</Context.Provider>
        );
    }

    function _use(): P {
        // @ts-ignore
        _checkAndPush(this);
        return useValue();
    }

    function useValue(): P {
        const value = React.useContext(Context);
        if (value === EMPTY) {
            throw new Error(
                'Component must be wrapped with <Container.Provider>',
            );
        }
        return value;
    }

    return { Provider, use: _use, useValue } as ContextProps<P>;
}

export function provide<P>(ctxProps: ContextProps<P>[], dom: any) {
    ctxProps?.forEach((cp) => {
        const { Provider } = cp as any;
        dom = <Provider>{dom}</Provider>;
    });
    return dom;
}

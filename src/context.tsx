import React, { useMemo } from 'react';

const EMPTY: unique symbol = Symbol();

export interface ContextPropsProviderProps<P> {
    children: React.ReactNode;
}

export interface ContextProps<P> {
    Provider: React.ComponentType<ContextPropsProviderProps<P>>;
    useContextProps: () => P;
}

export function createContextProps<P>(init?: () => P): ContextProps<P> {
    const Context = React.createContext<P | typeof EMPTY>(EMPTY);

    function Provider(props: ContextPropsProviderProps<P>) {
        const value = useMemo(() => init?.(), []);
        return (
            <Context.Provider value={value}>{props.children}</Context.Provider>
        );
    }

    function useContextProps(): P {
        const value = React.useContext(Context);
        if (value === EMPTY) {
            throw new Error(
                'Component must be wrapped with <Container.Provider>',
            );
        }
        return value;
    }

    return { Provider, useContextProps };
}

export function provide<P>(ctxProps: ContextProps<P>[], dom: any) {
    ctxProps?.forEach((cp) => {
        dom = <cp.Provider>{dom}</cp.Provider>;
    });
    return dom;
}

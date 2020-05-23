import React, { useMemo } from 'react';
import { _checkAndPush } from './func';
import { ContextProps } from './model';

const EMPTY: unique symbol = Symbol();

export function createContextProps<P>(init: () => P): ContextProps<P> {
    const Context = React.createContext<P | typeof EMPTY>(EMPTY);

    function _Provider(props) {
        const value = useMemo(() => init(), []);
        return (
            <Context.Provider value={value}>{props.children}</Context.Provider>
        );
    }

    function _use(): P {
        // @ts-ignore
        _checkAndPush(this);
        return _useValue();
    }

    function _useValue(): P {
        const value = React.useContext(Context);
        if (value === EMPTY) {
            throw new Error(
                'Component must be wrapped with <Container.Provider>',
            );
        }
        return value;
    }

    return { use: _use, _Provider, _useValue } as ContextProps<P>;
}

export function _provide<T>(
    ctxProps: ContextProps<any>[],
    Comp: React.FC<T>,
): React.FC<T> {
    if (ctxProps == null) {
        return React.memo(Comp);
    }

    return React.memo((props) => {
        let dom = <Comp {...props} />;
        ctxProps.forEach((cp) => {
            const { _Provider } = cp as any;
            dom = <_Provider>{dom}</_Provider>;
        });
        return dom;
    });
}

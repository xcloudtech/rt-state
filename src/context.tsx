import React, { useMemo } from 'react';
import { _checkAndPush } from './func';
import { Provider } from './model';

const EMPTY: unique symbol = Symbol();

export function createProvider<T>(init: () => T): Provider<T> {
    const Context = React.createContext<T | typeof EMPTY>(EMPTY);

    function _Provider(props) {
        const value = useMemo(() => init(), []);
        return (
            <Context.Provider value={value}>{props.children}</Context.Provider>
        );
    }

    function _use(): T {
        // @ts-ignore
        _checkAndPush(this);
        return _useValue();
    }

    function _useValue(): T {
        const value = React.useContext(Context);
        if (value === EMPTY) {
            throw new Error('Cannot find provider for it.');
        }
        return value;
    }

    return { use: _use, _Provider, _useValue } as Provider<T>;
}

export function _provide<T>(
    providers: Provider<any>[],
    Comp: React.FC<T>,
): React.FC<T> {
    if (providers == null) {
        return React.memo(Comp);
    }

    return React.memo((props) => {
        let dom = <Comp {...props} />;
        providers.forEach((p) => {
            const { _Provider } = p as any;
            dom = <_Provider>{dom}</_Provider>;
        });
        return dom;
    });
}

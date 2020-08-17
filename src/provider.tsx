import * as React from 'react';
import { Context, useEffect, useMemo, useRef } from 'react';
import { _checkAndPush } from './func';
import { Provider } from './model';
import { ctxContainer } from './context';

export function createProvider<T, I>(setup: (initValue: I) => T): Provider<T, I> {
    const Context = React.createContext<T>(null);

    function _Provider(props) {
        const { initValue } = props;
        const unWatchersRef = useRef<any[]>(null);
        const value = useMemo(() => {
            ctxContainer.unWatchersInProviderSetup = [];
            const val = setup(initValue);
            unWatchersRef.current = ctxContainer.unWatchersInProviderSetup;
            ctxContainer.unWatchersInProviderSetup = null;
            return val;
        }, []);
        useEffect(() => {
            return () => {
                unWatchersRef.current.forEach((cb) => {
                    cb();
                });
            };
        }, []);
        return <Context.Provider value={value}>{props.children}</Context.Provider>;
    }

    function use(): T {
        // @ts-ignore
        _checkAndPush(this);
        return React.useContext(Context);
    }

    function init(value: I) {
        return { ...provider, initValue: value } as Provider<T, I>;
    }

    const provider = { use, init, _Provider, Context };

    return { ...provider, initValue: null } as Provider<T, I>;
}

export function _provide<T>(providers: Provider<any, any>[], Comp: React.FC<T>): React.FC<T> {
    if (providers == null) {
        return React.memo(Comp);
    }

    return React.memo((props) => {
        let dom = <Comp {...props} />;
        providers.forEach((p) => {
            const { _Provider, initValue } = p as any;
            dom = <_Provider initValue={initValue}>{dom}</_Provider>;
        });
        return dom;
    });
}

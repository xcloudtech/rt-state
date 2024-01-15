import * as React from 'react';
import { Context, useEffect, useMemo } from 'react';
import { Provider } from './model';
import { ctxContainer } from './context';
import { ProviderSetupContext } from './common';

export function createProvider<T, I>(setup: (initValue: I) => T): Provider<T, I> {
    const Context = React.createContext<T>(null);

    function _Provider(props) {
        const { initValue } = props;
        const ctx = useMemo<ProviderSetupContext>(() => {
            return { _isInSetup: true, value: null, unWatchers: [] };
        }, []);
        if (ctx._isInSetup) {
            ctxContainer.currProviderSetupCtx = ctx;
            ctx.value = setup(initValue);
            ctx._isInSetup = false;
            ctxContainer.currProviderSetupCtx = null;
        } else {
            ctx._providers?.forEach((p) => {
                p.use();
            });
        }
        useEffect(() => {
            return () => {
                ctx.unWatchers.forEach((cb) => {
                    cb();
                });
            };
        }, []);
        const { value } = ctx;
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

function _checkAndPush<P>(provider: Provider<P, any>) {
    const currCtx = ctxContainer.currCtx;
    if (currCtx?._isInSetup) {
        // eslint-disable-next-line eqeqeq
        if (currCtx._hooksCb != null) {
            throw new Error('"Provider.use()" can only be used before "hooks" if it\'s in setup function.');
        }
        currCtx._providers = currCtx._providers ?? [];
        currCtx._providers.push(provider);
        return;
    }
    const currProviderCtx = ctxContainer.currProviderSetupCtx;
    if (currProviderCtx?._isInSetup) {
        currProviderCtx._providers = currProviderCtx._providers ?? [];
        currProviderCtx._providers.push(provider);
        return;
    }
}

export function _provide<T extends object>(
    Comp: React.FC<T>,
    providers: Provider<any, any>[],
): React.NamedExoticComponent<T> {
    // eslint-disable-next-line eqeqeq
    if (providers == null) {
        return React.memo<T>(Comp);
    }

    return React.memo<T>((props) => {
        let dom = <Comp {...props} />;
        providers.forEach((p) => {
            const { _Provider, initValue } = p as any;
            dom = <_Provider initValue={initValue}>{dom}</_Provider>;
        });
        return dom;
    });
}

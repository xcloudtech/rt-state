import * as React from 'react';
import { create, createProvider, rst } from '../';

const ProviderX = rst.createProvider((initValue: number) => {
    const x = rst.stateS(initValue ?? 10);
    const add = () => x.value++;
    return { x, add };
});

const ProviderY = rst.createProvider((initValue?: number) => {
    const y = rst.stateS(initValue ?? 20);
    const add = () => y.value++;
    return { y, add };
});

export const DemoProviderContainer = rst.create<{
    callCount?: () => void;
    childCallCount?: () => void;
    childChildCallCount?: () => void;
}>(
    (ctx) => {
        ctx.props.callCount?.();
        const providerX = ProviderX.use();
        const providerY = ProviderY.use();
        function addAll() {
            providerX.add();
            providerY.add();
        }
        return (props) => {
            ctx.props.callCount?.();
            return (
                <>
                    <button data-testid="addAll" onClick={addAll}>
                        addAll
                    </button>
                    <Child callCount={props.childCallCount} childChildCallCount={props.childChildCallCount} />
                </>
            );
        };
    },
    { providers: [ProviderX.init(99), ProviderY] },
);

const Child = rst.create<{
    callCount?: () => void;
    childChildCallCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    // provider.use() can only be used in the following cases:
    // *. at the beginning of this setup function.
    // *. or at the beginning of the render function.
    const providerX = ProviderX.use();
    return (props) => {
        props.callCount?.();
        const providerY = ProviderY.use();
        return (
            <div>
                <span data-testid="child.xy">
                    x:({providerX.x.value}) y:({providerY.y.value})
                </span>
                <button data-testid="child.providerX.add" onClick={providerX.add}>
                    providerX.add
                </button>
                <button data-testid="child.providerY.add" onClick={providerY.add}>
                    providerY.add
                </button>
                <ChildChild callCount={props.childChildCallCount} />
            </div>
        );
    };
});

const ChildChild = rst.createS<{
    callCount?: () => void;
}>(
    (props) => {
        props.callCount?.();
        const providerX = ProviderX.use();
        const providerY = ProviderY.use();
        return (
            <>
                <span data-testid="child.child.xy">
                    x:({providerX.x.value}) y:({providerY.y.value})
                </span>
                <button data-testid="child.child.providerY.add" onClick={providerY.add}>
                    providerY.add
                </button>
            </>
        );
    },
    { providers: [ProviderY.init(999)] },
);

///////////////////////////////////////////
const ProviderWithWatch = rst.createProvider((initValue: number) => {
    const watchCount = rst.stateS(0);
    const x = rst.stateS(initValue ?? 10);
    rst.watch(
        (values, oldValues) => {
            watchCount.value++;
        },
        () => [x.value],
    );
    const add = () => x.value++;
    return { watchCount, x, add };
});

export const DemoProviderWithWatch = rst.create<{
    callCount?: () => void;
}>(
    (ctx) => {
        ctx.props.callCount?.();
        const providerWithWatch = ProviderWithWatch.use();
        return (props) => {
            props.callCount?.();
            return (
                <div>
                    {rst.view(() => {
                        props.callCount?.();
                        return <span data-testid="x">x:({providerWithWatch.x.value})</span>;
                    })}
                    {rst.view(() => {
                        props.callCount?.();
                        return <span data-testid="watchCount">watchCount:({providerWithWatch.watchCount.value})</span>;
                    })}
                    <button data-testid="add" onClick={providerWithWatch.add}>
                        add
                    </button>
                </div>
            );
        };
    },
    { providers: [ProviderWithWatch.init(30)] },
);

///////////////////////////////////////////
const ProviderWithUse = rst.createProvider(() => {
    const providerX = ProviderX.use();
    return { xState: providerX.x };
});

export const DemoProviderWithUseContainer = rst.createS<{
    callCount?: () => void;
}>(
    (props) => {
        props.callCount?.();
        const providerX = ProviderX.use();
        function add() {
            providerX.add();
        }
        return (
            <div>
                <button data-testid="add" onClick={add}>
                    add
                </button>
                <DemoProviderWithUse />
            </div>
        );
    },
    { providers: [ProviderX] },
);

const DemoProviderWithUse = create(
    (ctx) => {
        const provider = ProviderWithUse.use();
        return (props) => {
            return <div data-testid="xx">xx:({provider.xState.value})</div>;
        };
    },
    { providers: [ProviderWithUse] },
);

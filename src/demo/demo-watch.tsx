import * as React from 'react';
import { rst } from '../';

export const DemoWatch = rst.create<{
    watch1CallCount?: () => void;
    watch2CallCount?: () => void;
    callCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    const data = rst.state({ v1: 0, v2: 100 });
    let sum;
    rst.watch(
        (values) => {
            ctx.props.watch1CallCount?.();
            const newSum = values[0];
            if (newSum !== sum) {
                sum = newSum;
                ctx.forceUpdate();
            }
        },
        () => [data.v1 + data.v2],
    );

    rst.watch(
        async (values) => {
            ctx.props.watch2CallCount?.();
        },
        () => [data.v1, data.v2],
    );

    const change = () => {
        let i = 1;
        while (i < 10000) {
            data.v1 += 1;
            data.v2 -= 1;
            i++;
        }
    };

    return () => {
        ctx.props.callCount?.();
        return (
            <div>
                <button data-testid="change" onClick={change}>
                    change
                </button>
                <div data-testid="sum">sum:({sum})</div>
            </div>
        );
    };
});

export const DemoWatchProps = rst.create<{
    obj: { x?: number; y?: number };
    callCount?: () => void;
    watchCallCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    rst.watch(
        () => {
            ctx.props.watchCallCount?.();
        },
        () => [ctx.w().obj.x],
    );
    return (props) => {
        props.callCount?.();
        return (
            <div>
                <div data-testid="xy">
                    x:({props.obj.x}) y:({props.obj.y})
                </div>
            </div>
        );
    };
});

export const DemoWatchExternalState = rst.create<{
    state: { num: number };
    callCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    let nonReactiveData;
    rst.watch(
        () => {
            nonReactiveData = ctx.props.state.num * 2;
            if (nonReactiveData === 24) {
                // `the view will not be updated`.
                return;
            }
            ctx.forceUpdate();
        },
        () => [ctx.w().state.num],
    );
    return (props) => {
        props.callCount?.();
        // This view doesn't depend on 'state.num', it won't change when data.num changes.
        // so, we need 'ctx.forceUpdate'.
        return <div data-testid="nonReactiveData">nonReactiveData:({nonReactiveData})</div>;
    };
});

export const DemoDisableDelay = rst.create<{
    watchCallCount?: () => void;
    callCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    const data = rst.state({ v1: 0, v2: 100 });

    rst.watch(
        (values) => {
            ctx.props.watchCallCount?.();
        },
        () => [data.v1 + data.v2],
    );

    const change = () => {
        for (let i = 0; i < 10; i++) {
            rst.unstable_disableDelay(() => {
                data.v1 += 1;
                data.v2 -= 1;
            });
        }
    };

    return () => {
        ctx.props.callCount?.();
        return (
            <div>
                <button data-testid="change" onClick={change}>
                    change
                </button>
                <div>unstable_disableDelay</div>
            </div>
        );
    };
});

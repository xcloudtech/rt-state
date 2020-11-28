import * as React from 'react';
import { rst } from '../';

const globalState = rst.state({ count: 10, num: 20 });

const watchCalledState = rst.stateS(0);

const globalWatcher = rst.watch(
    (values, oldValues) => {
        // console.log('globally shared data changed:', JSON.stringify(values));
        watchCalledState.value++;
    },
    () => [globalState.count, globalState.num],
    { global: true },
);

export const DemoGlobalStateAndWatcher = rst.create<{
    callCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    return (props) => {
        props.callCount?.();
        return (
            <>
                <button
                    data-testid="add"
                    onClick={() => {
                        globalState.count++;
                        globalState.num++;
                    }}>
                    add
                </button>
                <button
                    data-testid="unwatch"
                    onClick={() => {
                        globalWatcher.unwatch();
                    }}>
                    unwatch
                </button>
                <Child callCount={props.callCount} />

                {rst.view(() => {
                    return <div data-testid="watchCalled">watchCalled:({watchCalledState.value})</div>;
                })}
            </>
        );
    };
});

const Child = rst.create<{
    callCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    return (props) => {
        props.callCount?.();
        const { count, num } = globalState;
        return (
            <>
                <div data-testid="count">count:({count})</div>
                <div data-testid="num">num:({num})</div>
            </>
        );
    };
});

import * as React from 'react';
import { rst } from '../';

export const DemoCreateS = rst.createS((props) => {
    // warning: don't use rst.state. Because this is render function, not setup function of rst.create.
    const state = rst.useRState({ count: 10 });
    return (
        <div>
            <button data-testid="add" onClick={() => state.count++}>
                add
            </button>
            <div data-testid="count">count:({state.count})</div>
        </div>
    );
});

export const DemoDefaultProps = rst.createS<{ x: number; y?: number; obj?: { ox?: number; oy?: number } }>(
    (props) => {
        return (
            <div>
                <div data-testid="xy">
                    x:{props.x} y:{props.y}
                </div>
                <div data-testid="obj">
                    (ox:{props.obj?.ox} oy:{props.obj?.oy})
                </div>
            </div>
        );
    },
    { defaultProps: { y: 1003, obj: { ox: 1, oy: 2 } } },
);

export const DemoBatchReRender = rst.create<{
    x?: string;
    callCount?: () => void;
}>((ctx) => {
    ctx.props.callCount?.();
    const data = rst.stateS(100);
    function addManyTimes() {
        for (let i = 0; i < 100000; i++) {
            data.value++;
        }
    }
    return () => {
        ctx.props.callCount?.();
        return (
            <div>
                <button data-testid="add" onClick={addManyTimes}>
                    add
                </button>
                &nbsp;
                <div data-testid="value">value:({data.value})</div>
            </div>
        );
    };
});

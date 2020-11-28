import * as React from 'react';
import { rst } from '../';

export const DemoLink = rst.create((ctx) => {
    const state = rst.state({ count: 10 });
    let callCount = 0;

    const linkedState = rst.link<number>(() => state.count * 2);
    const linkedPlusState: rst.StateLink<number> = rst.link(
        () => state.count * 4,
        (newValue) => {
            state.count = newValue + 1000;
        },
    );
    return (props) => {
        callCount++;
        return (
            <>
                {rst.view(() => (
                    <div data-testid="state">
                        state:({state.count}) callCount:({callCount})
                    </div>
                ))}
                {rst.view(() => (
                    <div data-testid="linkedState">
                        linkedState:({linkedState.value}) callCount:({callCount})
                    </div>
                ))}
                {rst.view(() => (
                    <div data-testid="linkedPlusState">
                        linkedPlusState:({linkedPlusState.value}) callCount:({callCount})
                    </div>
                ))}
                <button
                    data-testid="addState"
                    onClick={() => {
                        state.count++;
                    }}>
                    addState
                </button>
                <button
                    data-testid="addLinkedPlusState"
                    onClick={() => {
                        linkedPlusState.value = state.count;
                    }}>
                    addLinkedPlusState
                </button>
            </>
        );
    };
});

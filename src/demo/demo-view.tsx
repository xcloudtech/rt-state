import React from 'react';
import { rst } from '../';

export const DemoUseRState: React.FC<{}> = () => {
    const state = rst.useRState({ count: 100 });

    return (
        <div>
            <div data-testid="non-reactive">non-reactive:{state.count}</div>
            {rst.view(() => (
                <div data-testid="reactive">reactive:{state.count}</div>
            ))}
            <button
                data-testid="add"
                onClick={() => {
                    state.count++;
                }}>
                add
            </button>
        </div>
    );
};

export const DemoUseRStateCreateSWrapper = rst.createS(DemoUseRState);

export const DemoUseRStateS: React.FC<{}> = (props) => {
    const stateS = rst.useRStateS({ count: 10 });

    function justAdd() {
        const { value: data } = stateS;
        data.count += 10;
    }
    function addAndForceUpdate() {
        justAdd();
        stateS.forceUpdate();
    }

    return (
        <div>
            <button data-testid="addAndForceUpdate" onClick={addAndForceUpdate}>
                addAndForceUpdate
            </button>
            <button data-testid="justAdd" onClick={justAdd}>
                justAdd
            </button>
            {rst.view(() => {
                const { value: data } = stateS;
                return <div data-testid="reactive">reactive: {data.count}</div>;
            })}
        </div>
    );
};

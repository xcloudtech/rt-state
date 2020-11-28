import { create, createS, rst, setDebugComponentName, state, State, StateS } from '../index';
import * as React from 'react';

export const DemoState = rst.createS<{
    callCount?: () => void;
    state: State<{ x: number; y: number }>;
}>((props) => {
    props.callCount?.();
    return (
        <div>
            {rst.view(() => {
                props.callCount?.();
                return <div data-testid="x">x:({props.state.x})</div>;
            })}
            {rst.view(() => {
                props.callCount?.();
                return <div data-testid="y">y:({props.state.y})</div>;
            })}
        </div>
    );
});

export const DemoStateS = rst.createS<{
    callCount?: () => void;
    stateS: StateS<{ x: number; y: number }>;
}>((props) => {
    props.callCount?.();
    return (
        <div>
            {rst.view(() => {
                props.callCount?.();
                const { value: data } = props.stateS;
                return <div data-testid="x">x:({data.x})</div>;
            })}
            {rst.view(() => {
                props.callCount?.();
                const { value: data } = props.stateS;
                return <div data-testid="y">y:({data.y})</div>;
            })}
        </div>
    );
});

export const DemoSetState = create((ctx) => {
    const data = state({ x: 10, y: 20 });
    function setState() {
        rst.setState(data, { x: data.x + 1 } as any); // any is just for testing, remove any for prod.
    }
    function setStateError() {
        rst.setState(data, { x: data.x + 1, z: 22 } as any); // remove any for prod.
    }
    return (props) => {
        return (
            <div>
                <button data-testid="setState" onClick={setState}>
                    setState
                </button>
                <button data-testid="setStateError" onClick={setStateError}>
                    setStateError
                </button>
                {rst.view(() => (
                    <span data-testid="xy">
                        x:({data.x}) y:({data.y})
                    </span>
                ))}
                {rst.view(() => {
                    let v = data.x;
                    v = data.y;
                    return <span data-testid="json">json:({JSON.stringify(rst.extract(data))})</span>;
                })}
            </div>
        );
    };
});

export const DemoShowBadCase = createS((props) => {
    // don't create local state in render function,
    // because although the state change could trigger the re-rendering of this component,
    // it will be redefined during each rendering,
    // so its value will stay the same as the initial value.
    const data = state({ num: 10 });
    // console.log(data.num);
    // // "watch" can not be called in the render function.
    // watch(
    //     () => console.log('break!'),
    //     () => [null],
    // );
    // // can't call hooks in the render function.
    // hooks(() => {
    //     console.log('break');
    // });
    return (
        <span>
            <button data-testid="add" onClick={() => data.num++}>
                add
            </button>
            <span data-testid="state">state:{data.num}(will not change)</span>
            {rst.view(() => {
                return <span data-testid="state2">state:{data.num}(will not change)</span>;
            })}
        </span>
    );
});

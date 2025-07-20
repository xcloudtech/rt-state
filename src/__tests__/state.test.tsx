import { rst } from '../index';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { delay } from './utils';
import * as React from 'react';
import { DemoSetState, DemoShowBadCase, DemoState, DemoStateS } from '../demo/demo-state';

test('state: DemoState', async () => {
    const callCount = jest.fn();

    const state = rst.state({ x: 10, y: 20 });
    const { getByTestId, rerender } = render(<DemoState callCount={callCount} state={state} />);
    expect(callCount).toHaveBeenCalledTimes(3);
    expect(getByTestId('x')).toHaveTextContent('x:(10)');
    expect(getByTestId('y')).toHaveTextContent('y:(20)');

    callCount.mockClear();
    state.x++;
    await delay();
    expect(callCount).toHaveBeenCalledTimes(2);
    expect(getByTestId('x')).toHaveTextContent('x:(11)');
    expect(getByTestId('y')).toHaveTextContent('y:(20)');

    callCount.mockClear();
    const val = state.x;
    state.x = val;
    await delay();
    expect(callCount).toHaveBeenCalledTimes(0);

    callCount.mockClear();
    state.y++;
    await delay();
    expect(callCount).toHaveBeenCalledTimes(2);
    expect(getByTestId('x')).toHaveTextContent('x:(11)');
    expect(getByTestId('y')).toHaveTextContent('y:(21)');
});

test('state: separate DemoState', async () => {
    const callCount = jest.fn();

    const state = rst.state({ x: 10, y: 20 }, { separate: true });
    const { getByTestId } = render(<DemoState callCount={callCount} state={state} />);
    expect(callCount).toHaveBeenCalledTimes(3);
    expect(getByTestId('x')).toHaveTextContent('x:(10)');
    expect(getByTestId('y')).toHaveTextContent('y:(20)');

    callCount.mockClear();
    state.x++;
    await delay();
    expect(callCount).toHaveBeenCalledTimes(1);
    expect(getByTestId('x')).toHaveTextContent('x:(11)');
    expect(getByTestId('y')).toHaveTextContent('y:(20)');

    callCount.mockClear();
    const val = state.x;
    state.x = val;
    await delay();
    expect(callCount).toHaveBeenCalledTimes(0);

    callCount.mockClear();
    state.y++;
    await delay();
    expect(callCount).toHaveBeenCalledTimes(1);
    expect(getByTestId('x')).toHaveTextContent('x:(11)');
    expect(getByTestId('y')).toHaveTextContent('y:(21)');
});

test('state: DemoStateS', async () => {
    const callCount = jest.fn();

    const stateS = rst.stateS({ x: 10, y: 20 });
    const { getByTestId, rerender } = render(<DemoStateS callCount={callCount} stateS={stateS} />);
    expect(callCount).toHaveBeenCalledTimes(3);
    expect(getByTestId('x')).toHaveTextContent('x:(10)');
    expect(getByTestId('y')).toHaveTextContent('y:(20)');

    callCount.mockClear();
    stateS.value.x++;
    await delay();
    expect(callCount).toHaveBeenCalledTimes(0);
    expect(getByTestId('x')).toHaveTextContent('x:(10)');
    expect(getByTestId('y')).toHaveTextContent('y:(20)');

    stateS.forceUpdate();
    await delay();
    expect(callCount).toHaveBeenCalledTimes(2);
    expect(getByTestId('x')).toHaveTextContent('x:(11)');
    expect(getByTestId('y')).toHaveTextContent('y:(20)');

    callCount.mockClear();
    const val = stateS.value;
    stateS.value = val;
    await delay();
    expect(callCount).toHaveBeenCalledTimes(0);

    callCount.mockClear();
    stateS.value = { x: 11, y: 20 };
    await delay();
    expect(callCount).toHaveBeenCalledTimes(2);
    expect(getByTestId('x')).toHaveTextContent('x:(11)');
    expect(getByTestId('y')).toHaveTextContent('y:(20)');
});

test('state: DemoSetState', async () => {
    const { getByTestId, rerender } = render(<DemoSetState />);
    expect(getByTestId('xy')).toHaveTextContent('x:(10) y:(20)');
    const setStateButton = getByTestId('setState');
    const setStateErrorButton = getByTestId('setStateError');

    fireEvent.click(setStateButton);
    await delay();
    expect(getByTestId('xy')).toHaveTextContent('x:(11) y:()');
    expect(getByTestId('json')).toHaveTextContent('json:({"x":11})');

    const originalConsoleError = console.error;
    let errorMsg;
    console.error = function (msg: string) {
        errorMsg = msg;
    };
    fireEvent.click(setStateErrorButton);
    await delay();
    console.error = originalConsoleError;

    expect(getByTestId('xy')).toHaveTextContent('x:(12) y:()');
    expect(getByTestId('json')).toHaveTextContent('json:({"x":12})');
    expect(errorMsg).toBe('Cannot add property z, object is not extensible');
});

test('state: DemoShowBadCase', async () => {
    const { getByTestId, rerender } = render(<DemoShowBadCase />);
    expect(getByTestId('state')).toHaveTextContent('state:10(will not change)');
    const addButton = getByTestId('add');

    fireEvent.click(addButton);
    await delay();
    expect(getByTestId('state')).toHaveTextContent('state:10(will not change)');
    fireEvent.click(addButton);
    await delay();
    expect(getByTestId('state')).toHaveTextContent('state:10(will not change)');
    expect(getByTestId('state2')).toHaveTextContent('state:10(will not change)');
});

test('state: state extract', async () => {
    const stateS = rst.state({ x: 10, y: 20 });
    let data = rst.extract(stateS);
    expect(JSON.stringify(data)).toBe(JSON.stringify({ x: 10, y: 20 }));
    stateS.x++;
    data = rst.extract(stateS);
    expect(JSON.stringify(data)).toBe(JSON.stringify({ x: 11, y: 20 }));
});

import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { DemoDisableDelay, DemoWatch, DemoWatchExternalState, DemoWatchProps } from '../demo/demo-watch';
import { delay } from './utils';
import { rst } from '../index';

test('watch: DemoWatch', async () => {
    const watch1CallCount = jest.fn();
    const watch2CallCount = jest.fn();
    const callCount = jest.fn();
    const { getByTestId } = render(
        <DemoWatch watch1CallCount={watch1CallCount} watch2CallCount={watch2CallCount} callCount={callCount} />,
    );
    await delay();
    expect(watch1CallCount).toBeCalledTimes(1);
    expect(watch2CallCount).toBeCalledTimes(1);
    expect(callCount).toBeCalledTimes(2);
    const changeButton = getByTestId('change');

    watch1CallCount.mockClear();
    watch2CallCount.mockClear();
    callCount.mockClear();
    fireEvent.click(changeButton);
    await delay();
    expect(watch1CallCount).toBeCalledTimes(0);
    expect(watch2CallCount).toBeCalledTimes(1);
    expect(callCount).toBeCalledTimes(0);
});

test('watch: DemoWatchProps', async () => {
    const watchCallCount = jest.fn();
    const callCount = jest.fn();
    let obj = { x: 10, y: 20 };
    const { getByTestId, rerender } = render(
        <DemoWatchProps obj={obj} watchCallCount={watchCallCount} callCount={callCount} />,
    );
    await delay();
    expect(watchCallCount).toBeCalledTimes(1);
    expect(callCount).toBeCalledTimes(2);
    expect(getByTestId('xy')).toHaveTextContent('x:(10) y:(20)');

    watchCallCount.mockClear();
    callCount.mockClear();
    rerender(<DemoWatchProps obj={obj} watchCallCount={watchCallCount} callCount={callCount} />);
    await delay();
    expect(watchCallCount).toBeCalledTimes(0);
    expect(callCount).toBeCalledTimes(0);
    expect(getByTestId('xy')).toHaveTextContent('x:(10) y:(20)');

    watchCallCount.mockClear();
    callCount.mockClear();
    obj = { ...obj };
    rerender(<DemoWatchProps obj={obj} watchCallCount={watchCallCount} callCount={callCount} />);
    await delay();
    expect(watchCallCount).toBeCalledTimes(0);
    expect(callCount).toBeCalledTimes(1);
    expect(getByTestId('xy')).toHaveTextContent('x:(10) y:(20)');

    watchCallCount.mockClear();
    callCount.mockClear();
    obj = { x: 10, y: 20 };
    rerender(<DemoWatchProps obj={obj} watchCallCount={watchCallCount} callCount={callCount} />);
    await delay();
    expect(watchCallCount).toBeCalledTimes(0);
    expect(callCount).toBeCalledTimes(1);
    expect(getByTestId('xy')).toHaveTextContent('x:(10) y:(20)');

    watchCallCount.mockClear();
    callCount.mockClear();
    obj = { x: 11, y: 20 };
    rerender(<DemoWatchProps obj={obj} watchCallCount={watchCallCount} callCount={callCount} />);
    await delay();
    expect(watchCallCount).toBeCalledTimes(1);
    expect(callCount).toBeCalledTimes(1);
    expect(getByTestId('xy')).toHaveTextContent('x:(11) y:(20)');
});

test('watch: DemoWatchExternalState', async () => {
    const callCount = jest.fn();
    const state = rst.state({ num: 10 });
    const { getByTestId, rerender } = render(<DemoWatchExternalState state={state} callCount={callCount} />);
    await delay();
    expect(callCount).toBeCalledTimes(2);
    expect(getByTestId('nonReactiveData')).toHaveTextContent('nonReactiveData:(20)');

    callCount.mockClear();
    state.num++;
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(getByTestId('nonReactiveData')).toHaveTextContent('nonReactiveData:(22)');

    callCount.mockClear();
    state.num++;
    await delay();
    expect(callCount).toBeCalledTimes(0);
    expect(getByTestId('nonReactiveData')).toHaveTextContent('nonReactiveData:(22)');

    callCount.mockClear();
    state.num++;
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(getByTestId('nonReactiveData')).toHaveTextContent('nonReactiveData:(26)');
});

test('watch: DemoDisableDelay', async () => {
    const watchCallCount = jest.fn();
    const callCount = jest.fn();
    const { getByTestId } = render(<DemoDisableDelay watchCallCount={watchCallCount} callCount={callCount} />);
    await delay();
    expect(watchCallCount).toBeCalledTimes(1);
    expect(callCount).toBeCalledTimes(2);
    const changeButton = getByTestId('change');

    watchCallCount.mockClear();
    callCount.mockClear();
    fireEvent.click(changeButton);
    await delay();
    expect(watchCallCount).toBeCalledTimes(10);
    expect(callCount).toBeCalledTimes(0);
});

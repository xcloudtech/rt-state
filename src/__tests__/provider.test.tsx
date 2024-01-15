import { fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { delay } from './utils';
import { DemoProviderContainer, DemoProviderWithUseContainer, DemoProviderWithWatch } from '../demo/demo-provider';

test('provider: DemoProviderContainer', async () => {
    const callCount = jest.fn();
    const childCallCount = jest.fn();
    const childChildCallCount = jest.fn();
    const { getByTestId } = render(
        <DemoProviderContainer
            callCount={callCount}
            childCallCount={childCallCount}
            childChildCallCount={childChildCallCount}
        />,
    );
    const addAllButton = getByTestId('addAll');
    const childXAddButton = getByTestId('child.providerX.add');
    const childYAddButton = getByTestId('child.providerY.add');
    const childChildYAddButton = getByTestId('child.child.providerY.add');

    await delay();
    expect(callCount).toBeCalledTimes(2);
    expect(childCallCount).toBeCalledTimes(2);
    expect(childChildCallCount).toBeCalledTimes(1);
    expect(getByTestId('child.xy')).toHaveTextContent('x:(99) y:(20)');
    expect(getByTestId('child.child.xy')).toHaveTextContent('x:(99) y:(999)');

    callCount.mockClear();
    childCallCount.mockClear();
    childChildCallCount.mockClear();

    fireEvent.click(addAllButton);
    await delay();
    expect(callCount).toBeCalledTimes(0);
    expect(childCallCount).toBeCalledTimes(1);
    expect(childChildCallCount).toBeCalledTimes(1);
    expect(getByTestId('child.xy')).toHaveTextContent('x:(100) y:(21)');
    expect(getByTestId('child.child.xy')).toHaveTextContent('x:(100) y:(999)');

    callCount.mockClear();
    childCallCount.mockClear();
    childChildCallCount.mockClear();

    fireEvent.click(childXAddButton);
    await delay();
    expect(callCount).toBeCalledTimes(0);
    expect(childCallCount).toBeCalledTimes(1);
    expect(childChildCallCount).toBeCalledTimes(1);
    expect(getByTestId('child.xy')).toHaveTextContent('x:(101) y:(21)');
    expect(getByTestId('child.child.xy')).toHaveTextContent('x:(101) y:(999)');

    callCount.mockClear();
    childCallCount.mockClear();
    childChildCallCount.mockClear();

    fireEvent.click(childYAddButton);
    await delay();
    expect(callCount).toBeCalledTimes(0);
    expect(childCallCount).toBeCalledTimes(1);
    expect(childChildCallCount).toBeCalledTimes(0);
    expect(getByTestId('child.xy')).toHaveTextContent('x:(101) y:(22)');
    expect(getByTestId('child.child.xy')).toHaveTextContent('x:(101) y:(999)');

    callCount.mockClear();
    childCallCount.mockClear();
    childChildCallCount.mockClear();

    fireEvent.click(childChildYAddButton);
    await delay();
    expect(callCount).toBeCalledTimes(0);
    expect(childCallCount).toBeCalledTimes(0);
    expect(childChildCallCount).toBeCalledTimes(1);
    expect(getByTestId('child.xy')).toHaveTextContent('x:(101) y:(22)');
    expect(getByTestId('child.child.xy')).toHaveTextContent('x:(101) y:(1000)');
});

test('provider: DemoProviderWithWatch', async () => {
    const callCount = jest.fn();
    const { getByTestId } = render(<DemoProviderWithWatch callCount={callCount} />);
    const addButton = getByTestId('add');
    await delay();
    expect(callCount).toBeCalledTimes(4); // 2 + 2 views

    callCount.mockClear();

    fireEvent.click(addButton);
    await delay();
    expect(callCount).toBeCalledTimes(2);
    expect(getByTestId('x')).toHaveTextContent('x:(31)');
    expect(getByTestId('watchCount')).toHaveTextContent('watchCount:(2)');
});

test('provider: DemoProviderWithUseContainer', async () => {
    const callCount = jest.fn();
    const { getByTestId } = render(<DemoProviderWithUseContainer callCount={callCount} />);
    const addButton = getByTestId('add');
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(getByTestId('xx')).toHaveTextContent('xx:(10)');

    callCount.mockClear();

    fireEvent.click(addButton);
    await delay();
    expect(callCount).toBeCalledTimes(0);
    expect(getByTestId('xx')).toHaveTextContent('xx:(11)');
});

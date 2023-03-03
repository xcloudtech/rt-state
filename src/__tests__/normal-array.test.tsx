import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { DemoNormalArray } from '../demo/demo-normal-array';
import { delay } from './utils';

test('normal-array: DemoNormalArray', async () => {
    const callCount = jest.fn();
    const itemsCallCount = jest.fn();
    const itemsDisposeCallCount = jest.fn();
    const { getByTestId } = render(
        <DemoNormalArray
            callCount={callCount}
            itemsCallCount={itemsCallCount}
            itemsDisposeCallCount={itemsDisposeCallCount}
        />,
    );
    expect(callCount).toBeCalledTimes(2);
    expect(itemsCallCount).toBeCalledTimes(0);
    expect(itemsDisposeCallCount).toBeCalledTimes(0);

    const addButton = getByTestId('add');
    const removeButton = getByTestId('remove');
    const changeSecondItemButton = getByTestId('changeSecondItem');
    const resetButton = getByTestId('reset');

    callCount.mockClear();
    itemsCallCount.mockClear();
    itemsDisposeCallCount.mockClear();
    fireEvent.click(addButton);
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(itemsCallCount).toBeCalledTimes(2);
    expect(itemsDisposeCallCount).toBeCalledTimes(0);

    callCount.mockClear();
    itemsCallCount.mockClear();
    itemsDisposeCallCount.mockClear();
    fireEvent.click(addButton);
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(itemsCallCount).toBeCalledTimes(2);
    expect(itemsDisposeCallCount).toBeCalledTimes(0);

    callCount.mockClear();
    itemsCallCount.mockClear();
    itemsDisposeCallCount.mockClear();
    fireEvent.click(addButton);
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(itemsCallCount).toBeCalledTimes(2);
    expect(itemsDisposeCallCount).toBeCalledTimes(0);

    callCount.mockClear();
    itemsCallCount.mockClear();
    itemsDisposeCallCount.mockClear();
    fireEvent.click(changeSecondItemButton);
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(itemsCallCount).toBeCalledTimes(1);
    expect(itemsDisposeCallCount).toBeCalledTimes(0);

    callCount.mockClear();
    itemsCallCount.mockClear();
    itemsDisposeCallCount.mockClear();
    fireEvent.click(removeButton);
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(itemsCallCount).toBeCalledTimes(0);
    expect(itemsDisposeCallCount).toBeCalledTimes(1);

    callCount.mockClear();
    itemsCallCount.mockClear();
    itemsDisposeCallCount.mockClear();
    fireEvent.click(removeButton);
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(itemsCallCount).toBeCalledTimes(0);
    expect(itemsDisposeCallCount).toBeCalledTimes(1);

    callCount.mockClear();
    itemsCallCount.mockClear();
    itemsDisposeCallCount.mockClear();
    fireEvent.click(addButton);
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(itemsCallCount).toBeCalledTimes(2);
    expect(itemsDisposeCallCount).toBeCalledTimes(0);

    callCount.mockClear();
    itemsCallCount.mockClear();
    itemsDisposeCallCount.mockClear();
    fireEvent.click(resetButton);
    await delay();
    expect(callCount).toBeCalledTimes(1);
    expect(itemsCallCount).toBeCalledTimes(0);
    expect(itemsDisposeCallCount).toBeCalledTimes(2);
});

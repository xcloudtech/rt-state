import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { DemoGlobalStateAndWatcher } from '../demo/demo-global';
import { delay } from './utils';

test('global: DemoGlobalStateAndWatcher', async () => {
    const callCount = jest.fn();
    const { getByTestId } = render(<DemoGlobalStateAndWatcher callCount={callCount} />);
    expect(callCount).toBeCalledTimes(4);
    expect(getByTestId('count')).toHaveTextContent('count:(10)');
    const addButton = getByTestId('add');
    const unwatchButton = getByTestId('unwatch');

    fireEvent.click(addButton);
    // just re-render Child component
    await delay();
    expect(callCount).toBeCalledTimes(5);
    expect(getByTestId('watchCalled')).toHaveTextContent('watchCalled:(2)');

    await waitFor(() => {
        expect(getByTestId('count')).toHaveTextContent('count:(11)');
        expect(getByTestId('num')).toHaveTextContent('num:(21)');
    });

    fireEvent.click(addButton);
    await delay();
    // just re-render Child component
    expect(callCount).toBeCalledTimes(6);
    // just call watch cb once.
    expect(getByTestId('watchCalled')).toHaveTextContent('watchCalled:(3)');

    fireEvent.click(unwatchButton);
    await delay();
    fireEvent.click(addButton);
    await delay();
    // just re-render Child component
    expect(callCount).toBeCalledTimes(7);
    // will not call watch cb again.
    expect(getByTestId('watchCalled')).toHaveTextContent('watchCalled:(3)');
});

import { fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { delay } from './utils';
import { DemoHooks } from '../demo/demo-hooks';

test('hooks: DemoHooks', async () => {
    const hooksCallCount = jest.fn();
    const { getByTestId } = render(<DemoHooks hooksCallCount={hooksCallCount} />);
    await delay();
    expect(hooksCallCount).toHaveBeenCalledTimes(1);
    expect(getByTestId('num')).toHaveTextContent('num:(666)');
    const add1Button = getByTestId('add1');
    const add100Button = getByTestId('add100');

    hooksCallCount.mockClear();
    fireEvent.click(add1Button);
    await waitFor(() => {
        expect(getByTestId('num')).toHaveTextContent('num:(667)');
    });
    expect(hooksCallCount).toHaveBeenCalledTimes(1);

    hooksCallCount.mockClear();
    fireEvent.click(add100Button);
    await waitFor(() => {
        expect(getByTestId('num')).toHaveTextContent('num:(767)');
    });
    expect(hooksCallCount).toHaveBeenCalledTimes(1);
});
